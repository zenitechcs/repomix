# Development Setup

This guide walks you through setting up the Repomix development environment and provides an overview of the project structure.

## Prerequisites

- Node.js ≥ 18.0.0
- Git
- npm
- Docker (optional, for running the website or containerized development)

## Local Development

To set up Repomix for local development:

```bash
# Clone repository
git clone https://github.com/yamadashy/repomix.git
cd repomix

# Install dependencies
npm install

# Run CLI
npm run repomix
```

## Docker Development

You can also run Repomix using Docker:

```bash
# Build image
docker build -t repomix .

# Run container
docker run -v ./:/app -it --rm repomix
```

## Project Structure

The project is organized into the following directories:

```
src/
├── cli/          # CLI implementation
├── config/       # Configuration handling
├── core/         # Core functionality
│   ├── file/     # File handling
│   ├── metrics/  # Metrics calculation
│   ├── output/   # Output generation
│   ├── security/ # Security checks
├── mcp/          # MCP server integration
└── shared/       # Shared utilities
tests/            # Tests mirroring src/ structure
website/          # Documentation website
├── client/       # Frontend (VitePress)
└── server/       # Backend API
```

## Testing

We use [Vitest](https://vitest.dev/) for testing. To run the tests:

```bash
# Run tests
npm run test

# Test coverage
npm run test-coverage

# Linting
npm run lint-biome
npm run lint-ts
npm run lint-secretlint
```

## Coding Style

We use [Biome](https://biomejs.dev/) for linting and formatting. Please make sure your code follows the style guide by running:

```bash
npm run lint
```

## Release Process

For maintainers and contributors interested in the release process:

1. Update version
```bash
npm version patch  # or minor/major
```

2. Run tests and build
```bash
npm run test-coverage
npm run build
```

3. Publish
```bash
npm publish
```

New versions are managed by the maintainer. If you think a release is needed, open an issue to discuss it.

For more information about contributing to Repomix, see the [Contributing to Repomix](./index) guide.
