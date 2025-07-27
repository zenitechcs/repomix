/**
 * Memory usage utility functions for tracking and logging memory consumption
 */

export interface MemoryUsage {
  /** Used heap size in MB */
  heapUsed: number;
  /** Total heap size in MB */
  heapTotal: number;
  /** External memory usage in MB */
  external: number;
  /** RSS (Resident Set Size) in MB */
  rss: number;
  /** Heap usage percentage */
  heapUsagePercent: number;
}

/**
 * Get current memory usage statistics
 */
export function getMemoryUsage(): MemoryUsage {
  const memoryUsage = process.memoryUsage();

  // Convert bytes to MB
  const heapUsed = Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100;
  const heapTotal = Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100;
  const external = Math.round((memoryUsage.external / 1024 / 1024) * 100) / 100;
  const rss = Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100;

  const heapUsagePercent = Math.round((heapUsed / heapTotal) * 100 * 100) / 100;

  return {
    heapUsed,
    heapTotal,
    external,
    rss,
    heapUsagePercent,
  };
}

/**
 * Format memory usage for display
 */
export function formatMemoryUsage(usage: MemoryUsage): string {
  return `${usage.heapUsed}MB/${usage.heapTotal}MB (${usage.heapUsagePercent}%) RSS: ${usage.rss}MB`;
}

/**
 * Get a simplified memory usage object for logging
 */
export function getMemoryMetrics(): Record<string, number> {
  const usage = getMemoryUsage();
  return {
    heapUsedMB: usage.heapUsed,
    heapTotalMB: usage.heapTotal,
    rssMB: usage.rss,
    heapUsagePercent: usage.heapUsagePercent,
  };
}
