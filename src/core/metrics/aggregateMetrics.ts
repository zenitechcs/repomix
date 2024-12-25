import type { ProcessedFile } from '../file/fileTypes.js';
import type { TokenCounter } from '../tokenCount/tokenCount.js';
import type { FileMetrics } from './calculateIndividualFileMetrics.js';

export const aggregateMetrics = (
  fileMetrics: FileMetrics[],
  processedFiles: ProcessedFile[],
  output: string,
  tokenCounter: TokenCounter,
) => {
  const totalFiles = processedFiles.length;
  const totalCharacters = output.length;
  const totalTokens = tokenCounter.countTokens(output);

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
  };
};
