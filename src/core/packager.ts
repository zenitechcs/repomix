import type { RepomixConfigMerged } from '../config/configSchema.js';
import { RepomixError } from '../shared/errorHandle.js';
import { logMemoryUsage, withMemoryLogging } from '../shared/memoryUtils.js';
import type { RepomixProgressCallback } from '../shared/types.js';
import { collectFiles } from './file/fileCollect.js';
import { sortPaths } from './file/filePathSort.js';
import { processFiles } from './file/fileProcess.js';
import { searchFiles } from './file/fileSearch.js';
import type { ProcessedFile, RawFile } from './file/fileTypes.js';
import { GitDiffResult, getGitDiffs } from './git/gitDiffHandle.js';
import { calculateMetrics } from './metrics/calculateMetrics.js';
import { generateOutput } from './output/outputGenerate.js';
import { copyToClipboardIfEnabled } from './packager/copyToClipboardIfEnabled.js';
import { writeOutputToDisk } from './packager/writeOutputToDisk.js';
import type { SuspiciousFileResult } from './security/securityCheck.js';
import { validateFileSafety } from './security/validateFileSafety.js';

export interface PackResult {
  totalFiles: number;
  totalCharacters: number;
  totalTokens: number;
  fileCharCounts: Record<string, number>;
  fileTokenCounts: Record<string, number>;
  gitDiffTokenCount: number;
  suspiciousFilesResults: SuspiciousFileResult[];
  suspiciousGitDiffResults: SuspiciousFileResult[];
  processedFiles: ProcessedFile[];
  safeFilePaths: string[];
}

const defaultDeps = {
  searchFiles,
  collectFiles,
  processFiles,
  generateOutput,
  validateFileSafety,
  writeOutputToDisk,
  copyToClipboardIfEnabled,
  calculateMetrics,
  sortPaths,
  getGitDiffs,
};

export const pack = async (
  rootDirs: string[],
  config: RepomixConfigMerged,
  progressCallback: RepomixProgressCallback = () => {},
  overrideDeps: Partial<typeof defaultDeps> = {},
  explicitFiles?: string[],
): Promise<PackResult> => {
  const deps = {
    ...defaultDeps,
    ...overrideDeps,
  };

  logMemoryUsage('Pack - Start');

  progressCallback('Searching for files...');
  const filePathsByDir = await withMemoryLogging('Search Files', async () =>
    Promise.all(
      rootDirs.map(async (rootDir) => ({
        rootDir,
        filePaths: (await deps.searchFiles(rootDir, config, explicitFiles)).filePaths,
      })),
    ),
  );

  // Sort file paths
  progressCallback('Sorting files...');
  const allFilePaths = filePathsByDir.flatMap(({ filePaths }) => filePaths);
  const sortedFilePaths = deps.sortPaths(allFilePaths);

  // Regroup sorted file paths by rootDir
  const sortedFilePathsByDir = rootDirs.map((rootDir) => ({
    rootDir,
    filePaths: sortedFilePaths.filter((filePath: string) =>
      filePathsByDir.find((item) => item.rootDir === rootDir)?.filePaths.includes(filePath),
    ),
  }));

  progressCallback('Collecting files...');
  const rawFiles = await withMemoryLogging('Collect Files', async () =>
    (
      await Promise.all(
        sortedFilePathsByDir.map(({ rootDir, filePaths }) =>
          deps.collectFiles(filePaths, rootDir, config, progressCallback),
        ),
      )
    ).reduce((acc: RawFile[], curr: RawFile[]) => acc.concat(...curr), []),
  );

  // Get git diffs if enabled - run this before security check
  progressCallback('Getting git diffs...');
  const gitDiffResult = await deps.getGitDiffs(rootDirs, config);

  // Run security check and get filtered safe files
  const { safeFilePaths, safeRawFiles, suspiciousFilesResults, suspiciousGitDiffResults } = await withMemoryLogging(
    'Security Check',
    () => deps.validateFileSafety(rawFiles, progressCallback, config, gitDiffResult),
  );

  // Process files (remove comments, etc.)
  progressCallback('Processing files...');
  const processedFiles = await withMemoryLogging('Process Files', () =>
    deps.processFiles(safeRawFiles, config, progressCallback),
  );

  progressCallback('Generating output...');
  const output = await withMemoryLogging('Generate Output', () =>
    deps.generateOutput(rootDirs, config, processedFiles, safeFilePaths, gitDiffResult),
  );

  progressCallback('Writing output file...');
  await withMemoryLogging('Write Output', () => deps.writeOutputToDisk(output, config));

  await deps.copyToClipboardIfEnabled(output, progressCallback, config);

  const metrics = await withMemoryLogging('Calculate Metrics', () =>
    deps.calculateMetrics(processedFiles, output, progressCallback, config, gitDiffResult),
  );

  // Create a result object that includes metrics and security results
  const result = {
    ...metrics,
    suspiciousFilesResults,
    suspiciousGitDiffResults,
    processedFiles,
    safeFilePaths,
  };

  logMemoryUsage('Pack - End');

  return result;
};
