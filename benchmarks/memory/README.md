# Memory Benchmarks

This directory contains memory usage benchmarks and leak detection tools for repomix.

## Setup

Before running the benchmarks, install dependencies:

```bash
cd benchmarks/memory
npm install
```

## Available Scripts

All scripts use `--expose-gc` flag for manual garbage collection control.

### Memory Leak Detection (`simple-memory-test.js`)

Simple and fast memory leak detection:

```bash
# Quick leak check (20 iterations)
npm run leak:quick

# Watch mode - continuous monitoring (runs until stopped with Ctrl+C)
npm run leak:watch
```

### Detailed Memory Analysis (`memory-leak-test.js`)

Comprehensive analysis with multiple test configurations:

```bash
# Full analysis with multiple configurations and JSON report
npm run leak:analyze

# Quick analysis (20 iterations, 100ms delay)
npm run leak:analyze:quick

# Long-running analysis (200 iterations, 500ms delay)
npm run leak:analyze:long
```

### Direct Script Usage

```bash
# Simple memory test with custom parameters
node --expose-gc simple-memory-test.js [iterations] [delay_ms]

# Comprehensive benchmark
node --expose-gc memory-leak-test.js [iterations] [delay_ms]
```

## Scripts Description

### `simple-memory-test.js`
Basic memory leak detection with fixed iterations or continuous mode.
- Tracks heap and RSS memory usage
- Supports continuous mode with `-c` or `continuous` flag
- Logs memory growth percentages

### `memory-leak-test.js`
Comprehensive benchmark with multiple test configurations.
- Tests different repomix configurations
- Detailed memory analysis
- Automatic report generation
- Multiple test scenarios

## Understanding the Results

### Memory Metrics

- **Heap Memory**: JavaScript objects managed by V8's garbage collector
- **RSS (Resident Set Size)**: Total physical memory used by the process

### Warning Signs

- Heap growth > 100% may indicate JavaScript memory leaks
- RSS growth > 100% may indicate native module leaks or memory fragmentation
- Consistent upward trend in memory usage across iterations

### Healthy Patterns

- Heap memory returning to baseline after garbage collection
- RSS stabilizing after initial growth
- Memory usage plateauing after warm-up period

## Initial Findings

Based on initial tests:
- **Heap Memory**: Generally stable with proper garbage collection ✅
- **RSS Memory**: Shows significant growth (200%+) ⚠️

### Suspected Areas

1. Worker pool management (Tinypool)
2. Tree-sitter parser memory
3. Native module resource disposal
4. File processing buffers

## Output Files

- `memory-history-*.json`: Detailed memory usage history
- `memory-test-results-*.json`: Comprehensive test results
- `memory-test-output.txt`: Temporary output file (auto-cleaned)

## Tips

1. Always use `--expose-gc` flag for manual garbage collection
2. Run tests in isolation to avoid interference
3. Monitor system resources during long-running tests
4. Allow warm-up period before measuring growth
5. Run multiple test iterations for reliable results