import { type Mock, beforeEach, describe, expect, test, vi } from 'vitest';
import type { ProcessedFile } from '../../src/core/file/fileTypes.js';
import type { RepomixConfigMerged } from '../../src/config/configSchema.js';
import { displayTokenCountTree } from '../../src/core/tokenCount/displayTokenCountTree.js';
import { printTokenCountTree } from '../../src/cli/cliPrint.js';

vi.mock('../../src/core/tokenCount/displayTokenCountTree.js');

describe('printTokenCountTree', () => {
  const mockDisplayTokenCountTree = displayTokenCountTree as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should use existing token counts and display tree', () => {
    const processedFiles: ProcessedFile[] = [
      { path: 'src/file1.js', content: 'const a = 1;' },
      { path: 'src/file2.js', content: 'function test() {}' },
      { path: 'tests/test.js', content: 'test("example", () => {});' },
    ];

    const fileTokenCounts = {
      'src/file1.js': 5,
      'src/file2.js': 7,
      'tests/test.js': 10,
    };

    const config = {
      output: { tokenCountTree: true },
    } as RepomixConfigMerged;

    printTokenCountTree(processedFiles, fileTokenCounts, config);

    // Verify display function was called with default threshold of 0
    expect(mockDisplayTokenCountTree).toHaveBeenCalledWith(
      [
        { path: 'src/file1.js', tokens: 5 },
        { path: 'src/file2.js', tokens: 7 },
        { path: 'tests/test.js', tokens: 10 },
      ],
      0,
    );
  });

  test('should handle empty file list', () => {
    const processedFiles: ProcessedFile[] = [];
    const fileTokenCounts = {};
    const config = {
      output: { tokenCountTree: true },
    } as RepomixConfigMerged;

    printTokenCountTree(processedFiles, fileTokenCounts, config);

    expect(mockDisplayTokenCountTree).toHaveBeenCalledWith([], 0);
  });

  test('should pass minimum token count threshold to display function', () => {
    const processedFiles: ProcessedFile[] = [
      { path: 'src/file1.js', content: 'const a = 1;' },
      { path: 'src/file2.js', content: 'function test() {}' },
    ];

    const fileTokenCounts = {
      'src/file1.js': 5,
      'src/file2.js': 15,
    };

    const config = {
      output: { tokenCountTree: 10 },
    } as RepomixConfigMerged;

    printTokenCountTree(processedFiles, fileTokenCounts, config);

    // Verify display function was called with the specified threshold
    expect(mockDisplayTokenCountTree).toHaveBeenCalledWith(
      [
        { path: 'src/file1.js', tokens: 5 },
        { path: 'src/file2.js', tokens: 15 },
      ],
      10,
    );
  });

  test('should skip files without token counts', () => {
    const processedFiles: ProcessedFile[] = [
      { path: 'src/file1.js', content: 'const a = 1;' },
      { path: 'src/file2.js', content: 'function test() {}' },
      { path: 'src/file3.js', content: 'missing tokens' },
    ];

    const fileTokenCounts = {
      'src/file1.js': 5,
      'src/file2.js': 7,
      // 'src/file3.js' is missing
    };

    const config = {
      output: { tokenCountTree: true },
    } as RepomixConfigMerged;

    printTokenCountTree(processedFiles, fileTokenCounts, config);

    // Verify only files with token counts are included
    expect(mockDisplayTokenCountTree).toHaveBeenCalledWith(
      [
        { path: 'src/file1.js', tokens: 5 },
        { path: 'src/file2.js', tokens: 7 },
      ],
      0,
    );
  });
});
