import pMap from 'p-map';
import { getProcessConcurrency } from '../../shared/processConcurrency.js';
import type { RepomixProgressCallback } from '../../shared/types.js';
import type { ProcessedFile } from '../file/fileTypes.js';
import type { TokenCounter } from '../tokenCount/tokenCount.js';
import { type FileMetrics, calculateIndividualFileMetrics } from './calculateIndividualFileMetrics.js';

export const calculateAllFileMetrics = async (
  processedFiles: ProcessedFile[],
  tokenCounter: TokenCounter,
  progressCallback: RepomixProgressCallback,
): Promise<FileMetrics[]> => {
  return await pMap(
    processedFiles,
    (file, index) => calculateIndividualFileMetrics(file, index, processedFiles.length, tokenCounter, progressCallback),
    {
      concurrency: getProcessConcurrency(),
    },
  );
};
