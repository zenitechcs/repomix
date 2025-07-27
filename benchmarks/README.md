# Repomix Benchmarks

This directory contains various benchmarks and performance tests for repomix.

## Available Benchmarks

### Memory Benchmarks (`/memory`)
Tools for detecting memory leaks and monitoring memory usage patterns.

- Memory leak detection
- Real-time memory monitoring
- Comprehensive memory benchmarks
- RSS and heap memory tracking

See [memory/README.md](memory/README.md) for detailed instructions.

## Running Benchmarks

Each benchmark suite has its own package.json for isolation. To run:

```bash
# Navigate to specific benchmark
cd benchmarks/memory

# Install dependencies
npm install

# Run benchmarks
npm test
```

## Adding New Benchmarks

When adding new benchmark suites:

1. Create a new directory under `benchmarks/`
2. Add a `package.json` with necessary dependencies
3. Include a comprehensive `README.md`
4. Add `.gitignore` for output files
5. Ensure benchmarks can run independently

## Guidelines

- Keep benchmarks isolated from main codebase
- Use local dependencies when testing repomix
- Save results in JSON format for analysis
- Include visual output for real-time monitoring
- Document findings and suspected issues

## Benchmark Results

Results are typically saved as timestamped JSON files in each benchmark directory. These are git-ignored but can be shared for analysis.