import { setTimeout } from 'node:timers/promises';
import pc from 'picocolors';
import type { RepomixProgressCallback } from '../../shared/types.js';
import type { ProcessedFile } from '../file/fileTypes.js';
import type { TokenCounter } from '../tokenCount/tokenCount.js';

export interface FileMetrics {
  path: string;
  charCount: number;
  tokenCount: number;
}

export const calculateIndividualFileMetrics = async (
  file: ProcessedFile,
  index: number,
  totalFiles: number,
  tokenCounter: TokenCounter,
  progressCallback: RepomixProgressCallback,
): Promise<FileMetrics> => {
  const charCount = file.content.length;
  const tokenCount = tokenCounter.countTokens(file.content, file.path);

  progressCallback(`Calculating metrics... (${index + 1}/${totalFiles}) ${pc.dim(file.path)}`);

  // Sleep for a short time to prevent blocking the event loop
  await setTimeout(1);

  return { path: file.path, charCount, tokenCount };
};
