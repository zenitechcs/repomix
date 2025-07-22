import os from 'node:os';
import { Tinypool } from 'tinypool';
import { logger } from './logger.js';

// Worker initialization is expensive, so we prefer fewer threads unless there are many files
const TASKS_PER_THREAD = 100;

export const getProcessConcurrency = (): number => {
  return typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length;
};

export const getWorkerThreadCount = (numOfTasks: number): { minThreads: number; maxThreads: number } => {
  const processConcurrency = getProcessConcurrency();

  const minThreads = 1;

  // Limit max threads based on number of tasks
  const maxThreads = Math.max(minThreads, Math.min(processConcurrency, Math.ceil(numOfTasks / TASKS_PER_THREAD)));

  return {
    minThreads,
    maxThreads,
  };
};

export const initWorker = (numOfTasks: number, workerPath: string): Tinypool => {
  const { minThreads, maxThreads } = getWorkerThreadCount(numOfTasks);

  logger.trace(
    `Initializing worker pool with min=${minThreads}, max=${maxThreads} threads. Worker path: ${workerPath}`,
  );

  const startTime = process.hrtime.bigint();

  const pool = new Tinypool({
    filename: workerPath,
    minThreads,
    maxThreads,
    idleTimeout: 5000,
    workerData: {
      logLevel: logger.getLogLevel(),
    },
  });

  const endTime = process.hrtime.bigint();
  const initTime = Number(endTime - startTime) / 1e6; // Convert to milliseconds

  logger.debug(`Tinypool initialization took ${initTime.toFixed(2)}ms`);

  return pool;
};
