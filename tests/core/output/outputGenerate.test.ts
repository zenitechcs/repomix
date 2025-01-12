import process from 'node:process';
import {describe, expect, test} from 'vitest';
import type {ProcessedFile} from '../../../src/core/file/fileTypes.js';
import {generateOutput} from '../../../src/core/output/outputGenerate.js';
import {createMockConfig} from '../../testing/testUtils.js';
import {XMLParser} from "fast-xml-parser";

describe('outputGenerate', () => {
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
      {path: 'file1.txt', content: 'content1'},
      {path: 'dir/file2.txt', content: 'content2'},
    ];

    const output = await generateOutput(process.cwd(), mockConfig, mockProcessedFiles, []);

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
      {path: 'file1.txt', content: '<div>foo</div>'},
      {path: 'dir/file2.txt', content: 'if (a && b)'},
    ];

    const output = await generateOutput(process.cwd(), mockConfig, mockProcessedFiles, []);

    const parser = new XMLParser({ignoreAttributes: false});
    let parsedOutput = parser.parse(output);

    expect(parsedOutput.repomix.file_summary).not.toBeUndefined();
    expect(parsedOutput.repomix.files.file).toEqual([
      {"#text": mockProcessedFiles[0].content, "@_path": mockProcessedFiles[0].path},
      {"#text": mockProcessedFiles[1].content, "@_path": mockProcessedFiles[1].path},
    ]);
  });
});
