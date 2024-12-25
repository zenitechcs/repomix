import { type Mock, describe, expect, it, vi } from 'vitest';
import type { ProcessedFile } from '../../../src/core/file/fileTypes.js';
import { calculateAllFileMetrics } from '../../../src/core/metrics/calculateAllFileMetrics.js';
import { calculateIndividualFileMetrics } from '../../../src/core/metrics/calculateIndividualFileMetrics.js';
import type { TokenCounter } from '../../../src/core/tokenCount/tokenCount.js';
import type { RepomixProgressCallback } from '../../../src/shared/types.js';

vi.mock('../../../src/core/metrics/calculateIndividualFileMetrics.js');
vi.mock('../../shared/processConcurrency', () => ({
  getProcessConcurrency: () => 1,
}));

describe('calculateAllFileMetrics', () => {
  it('should calculate metrics for all files', async () => {
    const processedFiles: ProcessedFile[] = [
      { path: 'file1.txt', content: 'a'.repeat(100) },
      { path: 'file2.txt', content: 'b'.repeat(200) },
    ];
    const tokenCounter = {} as TokenCounter;
    const progressCallback: RepomixProgressCallback = vi.fn();

    (calculateIndividualFileMetrics as Mock).mockImplementation(
      (file, _index, _totalFiles, _tokenCounter, _progressCallback) => {
        return {
          path: file.path,
          charCount: file.content.length,
          tokenCount: file.content.length / 10,
        };
      },
    );

    const result = await calculateAllFileMetrics(processedFiles, tokenCounter, progressCallback);

    expect(calculateIndividualFileMetrics).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      { path: 'file1.txt', charCount: 100, tokenCount: 10 },
      { path: 'file2.txt', charCount: 200, tokenCount: 20 },
    ]);
  });
});
