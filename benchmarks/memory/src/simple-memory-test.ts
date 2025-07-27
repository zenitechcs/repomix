#!/usr/bin/env node

/**
 * Simple memory leak test for runCli
 * Tests local directory processing in a loop
 * Runs continuously until stopped with Ctrl+C
 */

import { runCli } from 'repomix';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { MemoryUsage } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const CONTINUOUS = process.argv[2] === 'continuous' || process.argv[2] === '-c';
const ITERATIONS = CONTINUOUS ? Infinity : (parseInt(process.argv[2]) || 100);
const DELAY = parseInt(process.argv[3]) || 200;

if (CONTINUOUS) {
  console.log(`🧪 Continuous Memory Test: Running until stopped (Ctrl+C), ${DELAY}ms delay`);
} else {
  console.log(`🧪 Simple Memory Test: ${ITERATIONS} iterations, ${DELAY}ms delay`);
}

function getMemoryMB(): Pick<MemoryUsage, 'heapUsed' | 'rss'> {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100,
    rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100,
  };
}

async function cleanup(): Promise<void> {
  try {
    await fs.unlink(path.join(__dirname, '../memory-test-output.txt'));
  } catch (error) {
    // Ignore if file doesn't exist
  }
}

async function runTest(): Promise<void> {
  const initialMemory = getMemoryMB();
  console.log(`📊 Initial: Heap ${initialMemory.heapUsed}MB, RSS ${initialMemory.rss}MB`);

  for (let i = 1; i <= ITERATIONS; i++) {
    try {
      // Run repomix on the src directory from project root
      await runCli(['.'], projectRoot, {
        include: 'src/**/*.ts',
        output: path.join(__dirname, '../memory-test-output.txt'),
        style: 'plain',
        quiet: true,
      });

      // Clean up output file
      await cleanup();

      // Log memory every 5 iterations
      if (i % 5 === 0) {
        const current = getMemoryMB();
        const heapGrowth = ((current.heapUsed - initialMemory.heapUsed) / initialMemory.heapUsed * 100).toFixed(1);
        const rssGrowth = ((current.rss - initialMemory.rss) / initialMemory.rss * 100).toFixed(1);

        console.log(`✅ Iteration ${i}: Heap ${current.heapUsed}MB (+${heapGrowth}%), RSS ${current.rss}MB (+${rssGrowth}%)`);

        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }

      // Delay between iterations
      await new Promise(resolve => setTimeout(resolve, DELAY));

    } catch (error) {
      console.error(`❌ Iteration ${i} failed:`, error instanceof Error ? error.message : String(error));
    }
  }

  if (!CONTINUOUS) {
    const finalMemory = getMemoryMB();
    const heapGrowth = ((finalMemory.heapUsed - initialMemory.heapUsed) / initialMemory.heapUsed * 100).toFixed(1);
    const rssGrowth = ((finalMemory.rss - initialMemory.rss) / initialMemory.rss * 100).toFixed(1);

    console.log(`\n📊 Final Results:`);
    console.log(`   Initial: Heap ${initialMemory.heapUsed}MB, RSS ${initialMemory.rss}MB`);
    console.log(`   Final:   Heap ${finalMemory.heapUsed}MB, RSS ${finalMemory.rss}MB`);
    console.log(`   Growth:  Heap +${heapGrowth}%, RSS +${rssGrowth}%`);

    if (parseFloat(heapGrowth) > 100 || parseFloat(rssGrowth) > 100) {
      console.log(`⚠️  WARNING: Significant memory growth detected!`);
    } else {
      console.log(`✅ Memory usage appears stable`);
    }
  }
}

// Handle graceful shutdown for continuous mode
process.on('SIGINT', () => {
  console.log('\n\n🛑 Test interrupted by user');
  const current = getMemoryMB();
  console.log(`📊 Final Memory: Heap ${current.heapUsed}MB, RSS ${current.rss}MB`);
  process.exit(0);
});

// Main execution
runTest().catch(console.error);
