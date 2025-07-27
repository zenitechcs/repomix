import type { RepomixConfigMerged } from '../../config/configSchema.js';
import type { RepomixProgressCallback } from '../../shared/types.js';
import type { ProcessedFile } from '../file/fileTypes.js';
import type { GitDiffResult } from '../git/gitDiffHandle.js';
import { calculateAllFileMetrics, calculateSelectiveFileMetrics } from './calculateAllFileMetrics.js';
import { calculateOutputMetrics } from './calculateOutputMetrics.js';

export interface CalculateMetricsResult {
  totalFiles: number;
  totalCharacters: number;
  totalTokens: number;
  fileCharCounts: Record<string, number>;
  fileTokenCounts: Record<string, number>;
  gitDiffTokenCount: number;
}

import { calculateGitDiffMetrics } from './calculateGitDiffMetrics.js';

export const calculateMetrics = async (
  processedFiles: ProcessedFile[],
  output: string,
  progressCallback: RepomixProgressCallback,
  config: RepomixConfigMerged,
  gitDiffResult: GitDiffResult | undefined,
  deps = {
    calculateAllFileMetrics,
    calculateSelectiveFileMetrics,
    calculateOutputMetrics,
    calculateGitDiffMetrics,
  },
): Promise<CalculateMetricsResult> => {
  progressCallback('Calculating metrics...');

  // For top files display optimization: calculate token counts only for top files by character count
  const topFilesLength = config.output.topFilesLength;
  const candidateFilesCount = Math.min(processedFiles.length, Math.max(topFilesLength * 10, topFilesLength));

  // Get top files by character count first
  const topFilesByChar = [...processedFiles]
    .sort((a, b) => b.content.length - a.content.length)
    .slice(0, candidateFilesCount);

  const topFilePaths = topFilesByChar.map((file) => file.path);

  const [selectiveFileMetrics, totalTokens, gitDiffTokenCount] = await Promise.all([
    deps.calculateSelectiveFileMetrics(processedFiles, topFilePaths, config.tokenCount.encoding, progressCallback),
    deps.calculateOutputMetrics(output, config.tokenCount.encoding, config.output.filePath),
    deps.calculateGitDiffMetrics(config, gitDiffResult),
  ]);

  const totalFiles = processedFiles.length;
  const totalCharacters = output.length;

  // Build character counts for all files
  const fileCharCounts: Record<string, number> = {};
  for (const file of processedFiles) {
    fileCharCounts[file.path] = file.content.length;
  }

  // Build token counts only for top files
  const fileTokenCounts: Record<string, number> = {};
  for (const file of selectiveFileMetrics) {
    fileTokenCounts[file.path] = file.tokenCount;
  }

  return {
    totalFiles,
    totalCharacters,
    totalTokens,
    fileCharCounts,
    fileTokenCounts,
    gitDiffTokenCount: gitDiffTokenCount,
  };
};
