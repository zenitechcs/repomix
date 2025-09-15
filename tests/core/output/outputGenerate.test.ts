import process from 'node:process';
import { XMLParser } from 'fast-xml-parser';
import { describe, expect, test, vi } from 'vitest';
import type { ProcessedFile } from '../../../src/core/file/fileTypes.js';
import { generateOutput } from '../../../src/core/output/outputGenerate.js';
import { createMockConfig } from '../../testing/testUtils.js';

describe('outputGenerate', () => {
  const mockDeps = {
    buildOutputGeneratorContext: vi.fn(),
    generateHandlebarOutput: vi.fn(),
    generateParsableXmlOutput: vi.fn(),
    generateParsableJsonOutput: vi.fn(),
    sortOutputFiles: vi.fn(),
  };
  test('generateOutput should use sortOutputFiles before generating content', async () => {
    const mockConfig = createMockConfig({
      output: {
        filePath: 'output.txt',
        style: 'plain',
        git: { sortByChanges: true },
      },
    });
    const mockProcessedFiles: ProcessedFile[] = [
      { path: 'file1.txt', content: 'content1' },
      { path: 'file2.txt', content: 'content2' },
    ];
    const sortedFiles = [
      { path: 'file2.txt', content: 'content2' },
      { path: 'file1.txt', content: 'content1' },
    ];

    mockDeps.sortOutputFiles.mockResolvedValue(sortedFiles);
    mockDeps.buildOutputGeneratorContext.mockResolvedValue({
      processedFiles: sortedFiles,
      config: mockConfig,
      treeString: '',
      generationDate: new Date().toISOString(),
      instruction: '',
      filesEnabled: true,
    });
    mockDeps.generateHandlebarOutput.mockResolvedValue('mock output');

    const output = await generateOutput(
      [process.cwd()],
      mockConfig,
      mockProcessedFiles,
      [],
      undefined,
      undefined,
      mockDeps,
    );

    expect(mockDeps.sortOutputFiles).toHaveBeenCalledWith(mockProcessedFiles, mockConfig);
    expect(mockDeps.buildOutputGeneratorContext).toHaveBeenCalledWith(
      [process.cwd()],
      mockConfig,
      [],
      sortedFiles,
      undefined,
      undefined,
    );
    expect(output).toBe('mock output');
  });

  test('generateOutput should write correct content to file (plain style)', async () => {
    const mockConfig = createMockConfig({
      output: {
        filePath: 'output.txt',
        style: 'plain',
        topFilesLength: 2,
        showLineNumbers: false,
        removeComments: false,
        removeEmptyLines: false,
      },
    });
    const mockProcessedFiles: ProcessedFile[] = [
      { path: 'file1.txt', content: 'content1' },
      { path: 'dir/file2.txt', content: 'content2' },
    ];

    const output = await generateOutput([process.cwd()], mockConfig, mockProcessedFiles, []);

    expect(output).toContain('File Summary');
    expect(output).toContain('File: file1.txt');
    expect(output).toContain('content1');
    expect(output).toContain('File: dir/file2.txt');
    expect(output).toContain('content2');
  });

  test('generateOutput should write correct content to file (parsable xml style)', async () => {
    const mockConfig = createMockConfig({
      output: {
        filePath: 'output.txt',
        style: 'xml',
        parsableStyle: true,
        topFilesLength: 2,
        showLineNumbers: false,
        removeComments: false,
        removeEmptyLines: false,
      },
    });
    const mockProcessedFiles: ProcessedFile[] = [
      { path: 'file1.txt', content: '<div>foo</div>' },
      { path: 'dir/file2.txt', content: 'if (a && b)' },
    ];

    const output = await generateOutput([process.cwd()], mockConfig, mockProcessedFiles, []);

    const parser = new XMLParser({ ignoreAttributes: false });
    const parsedOutput = parser.parse(output);

    expect(parsedOutput.repomix.file_summary).not.toBeUndefined();
    expect(parsedOutput.repomix.files.file).toEqual([
      {
        '#text': mockProcessedFiles[0].content,
        '@_path': mockProcessedFiles[0].path,
      },
      {
        '#text': mockProcessedFiles[1].content,
        '@_path': mockProcessedFiles[1].path,
      },
    ]);
  });

  test('generateOutput should write correct content to file (parsable markdown style)', async () => {
    const mockConfig = createMockConfig({
      output: {
        filePath: 'output.txt',
        style: 'markdown',
        parsableStyle: true,
        topFilesLength: 2,
        showLineNumbers: false,
        removeComments: false,
        removeEmptyLines: false,
      },
    });
    const mockProcessedFiles: ProcessedFile[] = [
      { path: 'file1.txt', content: 'content1' },
      { path: 'dir/file2.txt', content: '```\ncontent2\n```' },
    ];

    const output = await generateOutput([process.cwd()], mockConfig, mockProcessedFiles, []);

    expect(output).toContain('# File Summary');
    expect(output).toContain('## File: file1.txt');
    expect(output).toContain('````\ncontent1\n````');
    expect(output).toContain('## File: dir/file2.txt');
    expect(output).toContain('````\n```\ncontent2\n```\n````');
  });

  test('generateOutput (txt) should omit generationHeader when fileSummaryEnabled is false, but always include headerText if provided', async () => {
    const mockConfig = createMockConfig({
      output: {
        filePath: 'output.txt',
        style: 'plain',
        fileSummary: false,
        headerText: 'ALWAYS SHOW THIS HEADER',
      },
    });
    const mockProcessedFiles: ProcessedFile[] = [{ path: 'file1.txt', content: 'content1' }];
    const output = await generateOutput([process.cwd()], mockConfig, mockProcessedFiles, []);
    expect(output).not.toContain('This file is a merged representation'); // generationHeader
    expect(output).toContain('ALWAYS SHOW THIS HEADER');
  });

  test('generateOutput (xml) omits generationHeader when fileSummaryEnabled is false, but always includes headerText', async () => {
    const mockConfig = createMockConfig({
      output: {
        filePath: 'output.xml',
        style: 'xml',
        fileSummary: false,
        headerText: 'XML HEADER',
        parsableStyle: true,
      },
    });
    const mockProcessedFiles: ProcessedFile[] = [{ path: 'file1.txt', content: '<div>foo</div>' }];
    const output = await generateOutput([process.cwd()], mockConfig, mockProcessedFiles, []);
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsedOutput = parser.parse(output);
    expect(parsedOutput.repomix['#text']).toBeUndefined();
    expect(parsedOutput.repomix.user_provided_header).toBe('XML HEADER');
  });

  test('generateOutput (markdown) omits generationHeader when fileSummaryEnabled is false, but always includes headerText', async () => {
    const mockConfig = createMockConfig({
      output: {
        filePath: 'output.md',
        style: 'markdown',
        fileSummary: false,
        headerText: 'MARKDOWN HEADER',
        parsableStyle: false,
      },
    });
    const mockProcessedFiles: ProcessedFile[] = [{ path: 'file1.txt', content: 'content1' }];
    const output = await generateOutput([process.cwd()], mockConfig, mockProcessedFiles, []);
    expect(output).not.toContain('This file is a merged representation');
    expect(output).toContain('MARKDOWN HEADER');
  });
});
