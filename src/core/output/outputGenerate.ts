import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLBuilder } from 'fast-xml-parser';
import Handlebars from 'handlebars';
import type { RepomixConfigMerged } from '../../config/configSchema.js';
import { RepomixError } from '../../shared/errorHandle.js';
import { searchFiles } from '../file/fileSearch.js';
import { generateTreeString } from '../file/fileTreeGenerate.js';
import type { ProcessedFile } from '../file/fileTypes.js';
import type { OutputGeneratorContext } from './outputGeneratorTypes.js';
import {
  generateHeader,
  generateSummaryFileFormat,
  generateSummaryNotes,
  generateSummaryPurpose,
  generateSummaryUsageGuidelines,
} from './outputStyleDecorate.js';
import { getMarkdownTemplate } from './outputStyles/markdownStyle.js';
import { getPlainTemplate } from './outputStyles/plainStyle.js';
import { getXmlTemplate } from './outputStyles/xmlStyle.js';

interface RenderContext {
  readonly generationHeader: string;
  readonly summaryPurpose: string;
  readonly summaryFileFormat: string;
  readonly summaryUsageGuidelines: string;
  readonly summaryNotes: string;
  readonly headerText: string | undefined;
  readonly instruction: string;
  readonly treeString: string;
  readonly processedFiles: ReadonlyArray<ProcessedFile>;
  readonly fileSummaryEnabled: boolean;
  readonly directoryStructureEnabled: boolean;
  readonly escapeFileContent: boolean;
  readonly markdownCodeBlockDelimiter: string;
}

const createRenderContext = (outputGeneratorContext: OutputGeneratorContext): RenderContext => {
  return {
    generationHeader: generateHeader(outputGeneratorContext.generationDate),
    summaryPurpose: generateSummaryPurpose(),
    summaryFileFormat: generateSummaryFileFormat(),
    summaryUsageGuidelines: generateSummaryUsageGuidelines(
      outputGeneratorContext.config,
      outputGeneratorContext.instruction,
    ),
    summaryNotes: generateSummaryNotes(outputGeneratorContext.config),
    headerText: outputGeneratorContext.config.output.headerText,
    instruction: outputGeneratorContext.instruction,
    treeString: outputGeneratorContext.treeString,
    processedFiles: outputGeneratorContext.processedFiles,
    fileSummaryEnabled: outputGeneratorContext.config.output.fileSummary,
    directoryStructureEnabled: outputGeneratorContext.config.output.directoryStructure,
    escapeFileContent: outputGeneratorContext.config.output.parsableStyle,
    markdownCodeBlockDelimiter: '`'.repeat(
      Math.max(
        3,
        1 +
          outputGeneratorContext.processedFiles
            .map(
              (file) =>
                file.content
                  .match(/`*/g)
                  ?.map((s) => s.length)
                  .reduce((acc, l) => (l > acc ? l : acc), 0) ?? 0,
            )
            .reduce((acc, l) => (l > acc ? l : acc), 0),
      ),
    ),
  };
};

const generateParsableXmlOutput = async (renderContext: RenderContext): Promise<string> => {
  const xmlBuilder = new XMLBuilder({ ignoreAttributes: false });
  const xmlDocument = {
    repomix: {
      '#text': renderContext.generationHeader,
      file_summary: renderContext.fileSummaryEnabled
        ? {
            '#text': 'This section contains a summary of this file.',
            purpose: renderContext.summaryPurpose,
            file_format: `${renderContext.summaryFileFormat}
4. Repository files, each consisting of:
  - File path as an attribute
  - Full contents of the file`,
            usage_guidelines: renderContext.summaryUsageGuidelines,
            notes: renderContext.summaryNotes,
            additional_info: {
              user_provided_header: renderContext.headerText,
            },
          }
        : undefined,
      directory_structure: renderContext.directoryStructureEnabled ? renderContext.treeString : undefined,
      files: {
        '#text': "This section contains the contents of the repository's files.",
        file: renderContext.processedFiles.map((file) => ({
          '#text': file.content,
          '@_path': file.path,
        })),
      },
      instruction: renderContext.instruction ? renderContext.instruction : undefined,
    },
  };
  return xmlBuilder.build(xmlDocument);
};

const generateHandlebarOutput = async (config: RepomixConfigMerged, renderContext: RenderContext): Promise<string> => {
  let template: string;
  switch (config.output.style) {
    case 'xml':
      template = getXmlTemplate();
      break;
    case 'markdown':
      template = getMarkdownTemplate();
      break;
    default:
      template = getPlainTemplate();
  }

  const compiledTemplate = Handlebars.compile(template);
  return `${compiledTemplate(renderContext).trim()}\n`;
};

export const generateOutput = async (
  rootDir: string,
  config: RepomixConfigMerged,
  processedFiles: ProcessedFile[],
  allFilePaths: string[],
): Promise<string> => {
  const outputGeneratorContext = await buildOutputGeneratorContext(rootDir, config, allFilePaths, processedFiles);
  const renderContext = createRenderContext(outputGeneratorContext);

  if (!config.output.parsableStyle) return generateHandlebarOutput(config, renderContext);
  switch (config.output.style) {
    case 'xml':
      return generateParsableXmlOutput(renderContext);
    case 'markdown':
      return generateHandlebarOutput(config, renderContext);
    default:
      return generateHandlebarOutput(config, renderContext);
  }
};

export const buildOutputGeneratorContext = async (
  rootDir: string,
  config: RepomixConfigMerged,
  allFilePaths: string[],
  processedFiles: ProcessedFile[],
): Promise<OutputGeneratorContext> => {
  let repositoryInstruction = '';

  if (config.output.instructionFilePath) {
    const instructionPath = path.resolve(config.cwd, config.output.instructionFilePath);
    try {
      repositoryInstruction = await fs.readFile(instructionPath, 'utf-8');
    } catch {
      throw new RepomixError(`Instruction file not found at ${instructionPath}`);
    }
  }

  let emptyDirPaths: string[] = [];
  if (config.output.includeEmptyDirectories) {
    try {
      const searchResult = await searchFiles(rootDir, config);
      emptyDirPaths = searchResult.emptyDirPaths;
    } catch (error) {
      if (error instanceof Error) {
        throw new RepomixError(`Failed to search for empty directories: ${error.message}`);
      }
    }
  }
  return {
    generationDate: new Date().toISOString(),
    treeString: generateTreeString(allFilePaths, emptyDirPaths),
    processedFiles,
    config,
    instruction: repositoryInstruction,
  };
};
