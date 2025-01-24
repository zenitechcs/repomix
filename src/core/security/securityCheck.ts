import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import { Piscina } from 'piscina';
import { logger } from '../../shared/logger.js';
import { getWorkerThreadCount } from '../../shared/processConcurrency.js';
import type { RepomixProgressCallback } from '../../shared/types.js';
import type { RawFile } from '../file/fileTypes.js';
import type { SecurityCheckTask } from './workers/securityCheckWorker.js';

export interface SuspiciousFileResult {
  filePath: string;
  messages: string[];
}

const initTaskRunner = (numOfTasks: number) => {
  const { minThreads, maxThreads } = getWorkerThreadCount(numOfTasks);
  logger.trace(`Initializing worker pool with min=${minThreads}, max=${maxThreads} threads`);

  const pool = new Piscina({
    filename: new URL('./workers/securityCheckWorker.js', import.meta.url).href,
    minThreads,
    maxThreads,
    idleTimeout: 5000,
  });

  return (task: SecurityCheckTask) => pool.run(task);
};

export const runSecurityCheck = async (
  rawFiles: RawFile[],
  progressCallback: RepomixProgressCallback = () => {},
  deps = {
    initTaskRunner,
  },
): Promise<SuspiciousFileResult[]> => {
  const runTask = deps.initTaskRunner(rawFiles.length);
  const tasks = rawFiles.map(
    (file) =>
      ({
        filePath: file.path,
        content: file.content,
      }) satisfies SecurityCheckTask,
  );

  try {
    logger.trace(`Starting security check for ${tasks.length} files`);
    const startTime = process.hrtime.bigint();

    let completedTasks = 0;
    const totalTasks = tasks.length;

    const results = await Promise.all(
      tasks.map((task) =>
        runTask(task).then((result) => {
          completedTasks++;
          progressCallback(`Running security check... (${completedTasks}/${totalTasks}) ${pc.dim(task.filePath)}`);
          return result;
        }),
      ),
    );

    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1e6;
    logger.trace(`Security check completed in ${duration.toFixed(2)}ms`);

    return results.filter((result): result is SuspiciousFileResult => result !== null);
  } catch (error) {
    logger.error('Error during security check:', error);
    throw error;
  }
};
