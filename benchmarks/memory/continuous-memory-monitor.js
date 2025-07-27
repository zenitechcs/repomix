#!/usr/bin/env node

/**
 * Continuous memory monitoring for runCli
 * Runs indefinitely until stopped with Ctrl+C
 * Shows real-time memory graphs and statistics
 */

import { runCli } from 'repomix';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

// Configuration
const DELAY = parseInt(process.argv[2]) || 1000; // Default 1 second
const LOG_INTERVAL = parseInt(process.argv[3]) || 5; // Log every N iterations
const GRAPH_WIDTH = 60;

// Memory tracking
const memoryHistory = {
  heap: [],
  rss: [],
  timestamps: [],
};

let iteration = 0;
let startTime = Date.now();
let initialMemory = null;
let peakMemory = { heap: 0, rss: 0 };

console.log(`🔍 Continuous Memory Monitor for repomix`);
console.log(`📊 Delay: ${DELAY}ms, Log interval: every ${LOG_INTERVAL} iterations`);
console.log(`🛑 Press Ctrl+C to stop\n`);

function getMemoryMB() {
  const usage = process.memoryUsage();
  return {
    heap: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100,
    rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100,
  };
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

function drawGraph(values, max, label) {
  const normalized = values.map(v => Math.round((v / max) * 10));
  const graph = normalized.map(n => {
    if (n === 0) return ' ';
    if (n <= 3) return '▁';
    if (n <= 5) return '▃';
    if (n <= 7) return '▅';
    if (n <= 9) return '▇';
    return '█';
  }).join('');
  
  return `${label}: [${graph}] ${values[values.length - 1]}MB (max: ${max}MB)`;
}

function printStats() {
  const current = getMemoryMB();
  const elapsed = Date.now() - startTime;
  const heapGrowth = ((current.heap - initialMemory.heap) / initialMemory.heap * 100).toFixed(1);
  const rssGrowth = ((current.rss - initialMemory.rss) / initialMemory.rss * 100).toFixed(1);
  
  // Update peak values
  peakMemory.heap = Math.max(peakMemory.heap, current.heap);
  peakMemory.rss = Math.max(peakMemory.rss, current.rss);
  
  // Clear console for clean display
  console.clear();
  
  console.log(`🔍 Continuous Memory Monitor`);
  console.log(`⏱️  Running for: ${formatDuration(elapsed)}`);
  console.log(`🔄 Iterations: ${iteration}`);
  console.log(`📊 Current Iteration Rate: ${(iteration / (elapsed / 1000)).toFixed(1)} iter/s\n`);
  
  console.log(`Memory Usage:`);
  console.log(`  Heap: ${current.heap}MB (${heapGrowth > 0 ? '+' : ''}${heapGrowth}%)`);
  console.log(`  RSS:  ${current.rss}MB (${rssGrowth > 0 ? '+' : ''}${rssGrowth}%)`);
  console.log(`  Peak: Heap ${peakMemory.heap}MB, RSS ${peakMemory.rss}MB\n`);
  
  // Show memory graphs
  if (memoryHistory.heap.length > 0) {
    console.log(`Memory Trends (last ${memoryHistory.heap.length} samples):`);
    console.log(drawGraph(memoryHistory.heap, peakMemory.heap, 'Heap'));
    console.log(drawGraph(memoryHistory.rss, peakMemory.rss, 'RSS '));
  }
  
  // Warnings
  if (parseFloat(heapGrowth) > 100 || parseFloat(rssGrowth) > 100) {
    console.log(`\n⚠️  WARNING: Significant memory growth detected!`);
  }
  
  // Force garbage collection info
  if (global.gc) {
    console.log(`\n🗑️  Garbage collection available (use --expose-gc)`);
  }
}

async function cleanup() {
  try {
    await fs.unlink(path.join(__dirname, 'memory-monitor-output.txt'));
  } catch (error) {
    // Ignore if file doesn't exist
  }
}

async function runContinuousTest() {
  initialMemory = getMemoryMB();
  
  while (true) {
    iteration++;
    
    try {
      // Run repomix on the src directory
      await runCli(['.'], projectRoot, {
        include: 'src/**/*.ts',
        output: path.join(__dirname, 'memory-monitor-output.txt'),
        style: 'plain',
        quiet: true,
      });
      
      // Clean up output file
      await cleanup();
      
      // Track memory
      const current = getMemoryMB();
      memoryHistory.heap.push(current.heap);
      memoryHistory.rss.push(current.rss);
      memoryHistory.timestamps.push(Date.now());
      
      // Keep history limited to last 60 samples
      if (memoryHistory.heap.length > GRAPH_WIDTH) {
        memoryHistory.heap.shift();
        memoryHistory.rss.shift();
        memoryHistory.timestamps.shift();
      }
      
      // Update display
      if (iteration % LOG_INTERVAL === 0) {
        printStats();
        
        // Force garbage collection every 10 logs
        if (iteration % (LOG_INTERVAL * 10) === 0 && global.gc) {
          global.gc();
        }
      }
      
    } catch (error) {
      console.error(`\n❌ Iteration ${iteration} failed:`, error.message);
    }
    
    // Delay between iterations
    await new Promise(resolve => setTimeout(resolve, DELAY));
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Monitoring stopped by user');
  
  const current = getMemoryMB();
  const elapsed = Date.now() - startTime;
  const heapGrowth = ((current.heap - initialMemory.heap) / initialMemory.heap * 100).toFixed(1);
  const rssGrowth = ((current.rss - initialMemory.rss) / initialMemory.rss * 100).toFixed(1);
  
  console.log(`\n📊 Final Statistics:`);
  console.log(`   Duration: ${formatDuration(elapsed)}`);
  console.log(`   Total Iterations: ${iteration}`);
  console.log(`   Average Rate: ${(iteration / (elapsed / 1000)).toFixed(1)} iter/s`);
  console.log(`   Initial Memory: Heap ${initialMemory.heap}MB, RSS ${initialMemory.rss}MB`);
  console.log(`   Final Memory: Heap ${current.heap}MB, RSS ${current.rss}MB`);
  console.log(`   Peak Memory: Heap ${peakMemory.heap}MB, RSS ${peakMemory.rss}MB`);
  console.log(`   Growth: Heap ${heapGrowth}%, RSS ${rssGrowth}%`);
  
  // Save detailed history
  const historyFile = path.join(__dirname, `memory-history-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  try {
    await fs.writeFile(historyFile, JSON.stringify({
      summary: {
        duration: elapsed,
        iterations: iteration,
        initialMemory,
        finalMemory: current,
        peakMemory,
        growth: { heap: heapGrowth, rss: rssGrowth },
      },
      history: memoryHistory,
    }, null, 2));
    console.log(`\n💾 Detailed history saved to: ${historyFile}`);
  } catch (error) {
    console.error('Failed to save history:', error.message);
  }
  
  await cleanup();
  process.exit(0);
});

// Start monitoring
runContinuousTest().catch(console.error);