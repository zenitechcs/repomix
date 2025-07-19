import path from 'node:path';
import { logger, setLogLevelByWorkerData } from '../../../shared/logger.js';
import { readRawFile } from '../fileRead.js';

export interface FileCollectTask {
  filePath: string;
  rootDir: string;
  maxFileSize: number;
}

// Set logger log level from workerData if provided
setLogLevelByWorkerData();

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
