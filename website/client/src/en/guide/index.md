# Getting Started with Repomix

Repomix is a tool that packs your entire repository into a single, AI-friendly file. It's designed to help you feed your codebase to Large Language Models (LLMs) like ChatGPT, DeepSeek, Perplexity, Gemini, Gemma, Llama, Grok, and more.

[![npm](https://img.shields.io/npm/v/repomix.svg?maxAge=1000)](https://www.npmjs.com/package/repomix)
[![npm](https://img.shields.io/npm/d18m/repomix)](https://www.npmjs.com/package/repomix)
[![Actions Status](https://github.com/yamadashy/repomix/actions/workflows/ci.yml/badge.svg)](https://github.com/yamadashy/repomix/actions?query=workflow%3A"ci")
[![codecov](https://codecov.io/github/yamadashy/repomix/graph/badge.svg)](https://codecov.io/github/yamadashy/repomix)
[![Sponsors](https://img.shields.io/github/sponsors/yamadashy?logo=github)](https://github.com/sponsors/yamadashy)
[![Discord](https://badgen.net/discord/online-members/wNYzTwZFku?icon=discord&label=discord)](https://discord.gg/wNYzTwZFku)

## Quick Start

Run this command in your project directory:

```bash
npx repomix
```

That's it! You'll find a `repomix-output.xml` file containing your entire repository in an AI-friendly format.

You can then send this file to an AI assistant with a prompt like:

```
This file contains all the files in the repository combined into one.
I want to refactor the code, so please review it first.
```

The AI will analyze your entire codebase and provide comprehensive insights:

![Repomix File Usage 1](/images/docs/repomix-file-usage-1.png)

When discussing specific changes, the AI can help generate code. With features like Claude's Artifacts, you can even receive multiple interdependent files:

![Repomix File Usage 2](/images/docs/repomix-file-usage-2.png)

Happy coding! 🚀

## Core Features

- **AI-Optimized Output**: Formats your codebase for easy AI processing
- **Token Counting**: Tracks token usage for LLM context limits
- **Git-Aware**: Respects your `.gitignore` and `.git/info/exclude` files
- **Security-Focused**: Detects sensitive information
- **Multiple Output Formats**: Choose between plain text, XML, or Markdown

## What's Next?

- [Installation Guide](installation.md): Different ways to install Repomix
- [Usage Guide](usage.md): Learn about basic and advanced features
- [Configuration](configuration.md): Customize Repomix for your needs
- [Security Features](security.md): Learn about security checks

## Community

Join our [Discord community](https://discord.gg/wNYzTwZFku) for:
- Getting help with Repomix
- Sharing your experiences
- Suggesting new features
- Connecting with other users

## Support

Found a bug or need help?
- [Open an issue on GitHub](https://github.com/yamadashy/repomix/issues)
- Join our Discord server
- Check the [documentation](https://repomix.com)
