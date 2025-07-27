#!/usr/bin/env node

/**
 * Comprehensive memory leak test for runCli
 * Tests multiple configurations and generates detailed reports
 */

import { runCli } from 'repomix';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

// Configuration
const DEFAULT_ITERATIONS = 100;
const DEFAULT_DELAY = 100;
const MEMORY_LOG_INTERVAL = 10;
const FORCE_GC_INTERVAL = 20;

// Test configurations
const TEST_CONFIGS = [
  {
    name: 'Local Directory (src/)',
    args: ['.'],
    cwd: projectRoot,
    options: {
      include: 'src/**/*.ts',
      output: path.join(__dirname, 'test-output-1.txt'),
      style: 'plain',
      quiet: true,
    }
  },
  {
    name: 'Local Directory with compression',
    args: ['.'],
    cwd: projectRoot,
    options: {
      include: 'src/**/*.ts',
      output: path.join(__dirname, 'test-output-2.txt'),
      style: 'xml',
      compress: true,
      quiet: true,
    }
  },
  {
    name: 'Complex patterns',
    args: ['.'],
    cwd: projectRoot,
    options: {
      include: 'src/**/*.{ts,js}',
      ignore: '**/*.test.ts,**/*.d.ts',
      output: path.join(__dirname, 'test-output-3.txt'),
      style: 'markdown',
      quiet: true,
    }
  }
];

// Memory tracking
const memoryHistory = [];

const iterations = parseInt(process.argv[2]) || DEFAULT_ITERATIONS;
const delay = parseInt(process.argv[3]) || DEFAULT_DELAY;

console.log(`🧪 Comprehensive Memory Leak Test`);
console.log(`📋 Configuration: ${iterations} iterations, ${delay}ms delay`);
console.log(`🎯 Test Configurations: ${TEST_CONFIGS.length} different configs`);
console.log(`🛑 Press Ctrl+C to stop\n`);

function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    timestamp: new Date().toISOString(),
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100,
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100,
    external: Math.round(usage.external / 1024 / 1024 * 100) / 100,
    rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100,
    heapUsagePercent: Math.round((usage.heapUsed / usage.heapTotal) * 100 * 100) / 100,
  };
}

function forceGC() {
  if (global.gc) {
    global.gc();
    console.log('🗑️  Forced garbage collection');
  }
}

function logMemoryUsage(iteration, configName, error = null) {
  const usage = getMemoryUsage();
  memoryHistory.push({ iteration, configName, ...usage, error: !!error });
  
  const statusIcon = error ? '❌' : '✅';
  const errorText = error ? ` (ERROR: ${error.message})` : '';
  
  console.log(
    `${statusIcon} Iteration ${iteration}: ${configName} - ` +
    `Heap: ${usage.heapUsed}MB/${usage.heapTotal}MB (${usage.heapUsagePercent}%), ` +
    `RSS: ${usage.rss}MB${errorText}`
  );
}

async function cleanupFiles() {
  const filesToClean = TEST_CONFIGS.map(config => config.options.output);
  
  for (const file of filesToClean) {
    try {
      await fs.unlink(file);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`Failed to cleanup ${file}:`, error.message);
      }
    }
  }
}

function analyzeMemoryTrends() {
  if (memoryHistory.length < 10) return;
  
  const recent = memoryHistory.slice(-10);
  const initial = memoryHistory.slice(0, 10);
  
  const avgRecentHeap = recent.reduce((sum, entry) => sum + entry.heapUsed, 0) / recent.length;
  const avgInitialHeap = initial.reduce((sum, entry) => sum + entry.heapUsed, 0) / initial.length;
  const avgRecentRSS = recent.reduce((sum, entry) => sum + entry.rss, 0) / recent.length;
  const avgInitialRSS = initial.reduce((sum, entry) => sum + entry.rss, 0) / initial.length;
  
  const heapGrowth = ((avgRecentHeap - avgInitialHeap) / avgInitialHeap) * 100;
  const rssGrowth = ((avgRecentRSS - avgInitialRSS) / avgInitialRSS) * 100;
  
  console.log('\n📊 Memory Trend Analysis:');
  console.log(`   Heap Growth: ${heapGrowth.toFixed(2)}% (${avgInitialHeap.toFixed(2)}MB → ${avgRecentHeap.toFixed(2)}MB)`);
  console.log(`   RSS Growth: ${rssGrowth.toFixed(2)}% (${avgInitialRSS.toFixed(2)}MB → ${avgRecentRSS.toFixed(2)}MB)`);
  
  if (heapGrowth > 50 || rssGrowth > 50) {
    console.log('⚠️  WARNING: Significant memory growth detected - possible memory leak!');
  }
}

async function saveMemoryHistory() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(__dirname, `memory-test-results-${timestamp}.json`);
  
  const summary = {
    testInfo: {
      iterations: memoryHistory.length,
      configurations: TEST_CONFIGS.length,
      startTime: memoryHistory[0]?.timestamp,
      endTime: memoryHistory[memoryHistory.length - 1]?.timestamp,
    },
    memoryHistory,
    analysis: {
      peakHeapUsage: Math.max(...memoryHistory.map(h => h.heapUsed)),
      peakRSSUsage: Math.max(...memoryHistory.map(h => h.rss)),
      errorCount: memoryHistory.filter(h => h.error).length,
      averageHeapUsage: memoryHistory.reduce((sum, h) => sum + h.heapUsed, 0) / memoryHistory.length,
      averageRSSUsage: memoryHistory.reduce((sum, h) => sum + h.rss, 0) / memoryHistory.length,
    }
  };
  
  try {
    await fs.writeFile(filename, JSON.stringify(summary, null, 2));
    console.log(`\n💾 Memory test results saved to: ${filename}`);
  } catch (error) {
    console.error('Failed to save memory history:', error.message);
  }
}

async function runMemoryLeakTest() {
  // Log initial memory usage
  console.log('📊 Initial Memory Usage:');
  logMemoryUsage(0, 'Initial', null);
  
  console.log('\n🚀 Starting test iterations...\n');
  
  for (let i = 1; i <= iterations; i++) {
    const config = TEST_CONFIGS[(i - 1) % TEST_CONFIGS.length];
    let error = null;
    
    try {
      // Run the CLI with current configuration
      await runCli(config.args, config.cwd, config.options);
      
      // Clean up output files after each run
      await cleanupFiles();
      
    } catch (err) {
      error = err;
    }
    
    // Log memory usage at specified intervals or on error
    if (i % MEMORY_LOG_INTERVAL === 0 || error) {
      logMemoryUsage(i, config.name, error);
    }
    
    // Force garbage collection at specified intervals
    if (i % FORCE_GC_INTERVAL === 0) {
      forceGC();
    }
    
    // Analyze trends periodically
    if (i % (MEMORY_LOG_INTERVAL * 2) === 0 && i > 20) {
      analyzeMemoryTrends();
    }
    
    // Add delay between iterations
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.log('\n✅ Memory leak test completed!');
  
  // Final analysis
  console.log('\n📊 Final Memory Analysis:');
  const finalUsage = getMemoryUsage();
  const initialUsage = memoryHistory[0];
  
  console.log(`Initial: Heap ${initialUsage.heapUsed}MB, RSS ${initialUsage.rss}MB`);
  console.log(`Final:   Heap ${finalUsage.heapUsed}MB, RSS ${finalUsage.rss}MB`);
  console.log(`Growth:  Heap ${((finalUsage.heapUsed - initialUsage.heapUsed) / initialUsage.heapUsed * 100).toFixed(2)}%, RSS ${((finalUsage.rss - initialUsage.rss) / initialUsage.rss * 100).toFixed(2)}%`);
  
  // Save results
  await saveMemoryHistory();
  
  // Final cleanup
  await cleanupFiles();
  
  console.log('\n🎉 Test completed successfully!');
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\n⚠️  Test interrupted by user');
  await saveMemoryHistory();
  await cleanupFiles();
  process.exit(0);
});

process.on('uncaughtException', async (error) => {
  console.error('\n❌ Uncaught exception:', error);
  await saveMemoryHistory();
  await cleanupFiles();
  process.exit(1);
});

// Validate arguments
if (isNaN(iterations) || iterations <= 0) {
  console.error('❌ Invalid iterations count. Must be a positive number.');
  process.exit(1);
}

if (isNaN(delay) || delay < 0) {
  console.error('❌ Invalid delay. Must be a non-negative number.');
  process.exit(1);
}

// Run the test
runMemoryLeakTest().catch(async (error) => {
  console.error('\n❌ Test failed:', error);
  await saveMemoryHistory();
  await cleanupFiles();
  process.exit(1);
});