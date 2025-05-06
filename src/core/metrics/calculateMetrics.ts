import type { RepomixConfigMerged } from '../../config/configSchema.js';
import type { RepomixProgressCallback } from '../../shared/types.js';
import type { ProcessedFile } from '../file/fileTypes.js';
import type { GitDiffResult } from '../file/gitDiff.js';
import { calculateAllFileMetrics } from './calculateAllFileMetrics.js';
import { calculateOutputMetrics } from './calculateOutputMetrics.js';

export interface CalculateMetricsResult {
  totalFiles: number;
  totalCharacters: number;
  totalTokens: number;
  fileCharCounts: Record<string, number>;
  fileTokenCounts: Record<string, number>;
  diffTokenCount?: number;
}

import { TokenCounter } from './TokenCounter.js';

export const calculateMetrics = async (
  processedFiles: ProcessedFile[],
  output: string,
  progressCallback: RepomixProgressCallback,
  config: RepomixConfigMerged,
  gitDiffResult: GitDiffResult | undefined,
  deps = {
    calculateAllFileMetrics,
    calculateOutputMetrics,
  },
): Promise<CalculateMetricsResult> => {
  progressCallback('Calculating metrics...');

  // Calculate token count for git diffs if included
  let diffTokenCount: number | undefined;
  if (config.output.git?.includeDiffs && gitDiffResult?.workTreeDiffContent) {
    const tokenCounter = new TokenCounter(config.tokenCount.encoding);
    diffTokenCount = tokenCounter.countTokens(gitDiffResult.workTreeDiffContent);
    tokenCounter.free();
  }

  const [fileMetrics, totalTokens] = await Promise.all([
    deps.calculateAllFileMetrics(processedFiles, config.tokenCount.encoding, progressCallback),
    deps.calculateOutputMetrics(output, config.tokenCount.encoding, config.output.filePath),
  ]);

  const totalFiles = processedFiles.length;
  const totalCharacters = output.length;

  const fileCharCounts: Record<string, number> = {};
  const fileTokenCounts: Record<string, number> = {};
  for (const file of fileMetrics) {
    fileCharCounts[file.path] = file.charCount;
    fileTokenCounts[file.path] = file.tokenCount;
  }

  return {
    totalFiles,
    totalCharacters,
    totalTokens,
    fileCharCounts,
    fileTokenCounts,
    diffTokenCount,
  };
};
