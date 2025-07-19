import path from 'node:path';
import { logger, setLogLevelByWorkerData } from '../../../shared/logger.js';
import { readRawFile } from '../fileRead.js';

// Initialize logger configuration from workerData at module load time
// This must be called before any logging operations in the worker
setLogLevelByWorkerData();

export interface FileCollectTask {
  filePath: string;
  rootDir: string;
  maxFileSize: number;
}

export default async ({ filePath, rootDir, maxFileSize }: FileCollectTask) => {
  const fullPath = path.resolve(rootDir, filePath);
  const content = await readRawFile(fullPath, maxFileSize);

  if (content) {
    return {
      path: filePath,
      content,
    };
  }

  return null;
};
