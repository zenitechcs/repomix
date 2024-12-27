import pc from 'picocolors';
import { describe, expect, it, vi } from 'vitest';
import type { ProcessedFile } from '../../../src/core/file/fileTypes.js';
import { calculateIndividualFileMetrics } from '../../../src/core/metrics/calculateIndividualFileMetrics.js';
import type { TokenCounter } from '../../../src/core/tokenCount/tokenCount.js';
import type { RepomixProgressCallback } from '../../../src/shared/types.js';

describe('calculateIndividualFileMetrics', () => {
  it('should calculate file metrics and report progress', async () => {
    const file: ProcessedFile = { path: 'file1.txt', content: 'a'.repeat(100) };
    const index = 0;
    const totalFiles = 1;
    const tokenCounter = {
      countTokens: vi.fn().mockReturnValue(10),
    } as unknown as TokenCounter;
    const progressCallback: RepomixProgressCallback = vi.fn();

    const result = await calculateIndividualFileMetrics(file, index, totalFiles, tokenCounter, progressCallback);

    expect(tokenCounter.countTokens).toHaveBeenCalledWith(file.content, file.path);
    expect(progressCallback).toHaveBeenCalledWith(`Calculating metrics... (1/1) ${pc.dim('file1.txt')}`);
    expect(result).toEqual({
      path: 'file1.txt',
      charCount: 100,
      tokenCount: 10,
    });
  });
});
