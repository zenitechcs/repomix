import { parentPort } from 'node:worker_threads';

/**
 * Register cleanup function to be called when worker is terminated.
 * Handles both normal worker termination and process exit as fallback.
 *
 * @param cleanup Function to call on worker termination
 */
export const onWorkerTermination = (cleanup: () => void): void => {
  // Cleanup when worker is terminated normally
  if (parentPort) {
    parentPort.on('close', cleanup);
  }

  // Also cleanup on process exit as a fallback
  process.on('exit', cleanup);
};
