# Contributing to Repomix

Thank you for your interest in **Repomix**! 🚀 We'd love your help to make it even better. This guide will help you get started with contributing to the project.

## How to Contribute

- **Create an Issue**: Spot a bug? Have an idea for a new feature? Let us know by creating an issue.
- **Submit a Pull Request**: Found something to fix or improve? Jump in and submit a PR!
- **Spread the Word**: Share your experience with Repomix on social media, blogs, or with your tech community.
- **Use Repomix**: The best feedback comes from real-world usage, so feel free to integrate Repomix into your own projects!

## Quick Start

For a detailed development environment setup, please refer to the [Development Setup](./setup) guide.

```bash
git clone https://github.com/yamadashy/repomix.git
cd repomix
npm install
```

## Development Commands

```bash
# Run CLI
npm run repomix

# Run tests
npm run test
npm run test-coverage

# Lint code
npm run lint
```

## Code Style

- Use [Biome](https://biomejs.dev/) for linting and formatting
- Dependency injection for testability
- Keep files under 250 lines
- Add tests for new features

## Pull Request Guidelines

Before submitting a Pull Request, please ensure:

1. Your code passes all tests: Run `npm run test`
2. Your code adheres to our linting standards: Run `npm run lint`
3. You have updated relevant documentation
4. You follow the existing code style

## Website Development

The Repomix website is built with [VitePress](https://vitepress.dev/). To run the website locally:

```bash
# Prerequisites: Docker must be installed on your system

# Start the website development server
npm run website

# Access the website at http://localhost:5173/
```

When updating documentation, you only need to update the English version first. The maintainers will handle translations to other languages.

## Need Help?

- [Open an issue](https://github.com/yamadashy/repomix/issues)
- [Join Discord](https://discord.gg/wNYzTwZFku)
