# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Repomix Development Guide

Repomix is a tool that packs repository contents into single files optimized for AI consumption. It converts codebases into structured formats (XML, Markdown, Plain Text) with intelligent compression, security scanning, and token counting for LLM integration.

## Build & Development Commands
- `npm run build` - Build the project
- `npm run lint` - Run all linters (Biome, TypeScript, secretlint)
- `npm run lint-biome` - Run Biome linter with auto-fix
- `npm run lint-ts` - Run TypeScript type checking
- `npm test` - Run all tests
- `npm test -- /path/to/file.test.ts` - Run a specific test file
- `npm test -- -t "test name"` - Run tests matching description
- `npm run test-coverage` - Run tests with coverage report
- `npm run repomix` - Build and run the CLI tool
- `npm run repomix-src` - Pack only src and tests directories
- `npm run repomix-website` - Pack only website directory
- `npm run website` - Start local website development environment
- `npm run website-generate-schema` - Generate JSON schema for configuration

## Core Architecture

### File Processing Pipeline (`src/core/file/`)
- **fileCollect.ts**: Parallel file reading with worker threads for performance
- **fileProcess.ts**: Content transformation including comment removal and formatting
- **fileSearch.ts**: Glob pattern-based file discovery with gitignore integration
- **filePathSort.ts**: Git-aware file ordering by change frequency for optimal AI context

### Security & Validation (`src/core/security/`)
- **securityCheck.ts**: Multi-threaded Secretlint integration for sensitive data detection
- **validateFileSafety.ts**: Pre-processing file safety validation
- Uses worker threads for concurrent security scanning to prevent blocking

### Output Generation (`src/core/output/`)
- **outputGenerate.ts**: Multi-format support (XML default, Markdown, Plain Text)
- **outputStyles/**: Format-specific templates with Handlebars templating
- **outputStyleDecorate.ts**: Content decoration with line numbers and headers

### Tree-Sitter Integration (`src/core/treeSitter/`)
- **languageParser.ts**: 15+ language support for intelligent code parsing
- **parseStrategies/**: Language-specific parsing strategies for optimal compression
- Achieves ~70% token reduction while preserving semantic meaning

### CLI Architecture (`src/cli/`)
- **cliRun.ts**: Main CLI orchestrator using Commander.js
- **actions/**: Modular command handlers (default, remote, init, mcp, version)
- **defaultAction.ts**: Standard local repository processing workflow
- **remoteAction.ts**: GitHub URL/shorthand processing with branch/commit resolution

### MCP Server (`src/mcp/`)
- **mcpServer.ts**: Model Context Protocol server for AI assistant integration
- **tools/**: File system access, repository packing, and content search capabilities
- Provides sandboxed AI-to-codebase interaction layer

## Code Style Guidelines
- **Formatting**: 2 spaces indentation, 120 char line width, single quotes, trailing commas
- **Imports**: Use `node:` prefix for built-ins, `.js` extension for relative imports, `import type` for types
- **TypeScript**: Strict type checking, explicit return types, prefer interfaces for object types
- **Error Handling**: Custom errors extend `RepomixError`, descriptive messages, proper try/catch
- **Dependencies**: Inject dependencies through deps object parameter for testability
- **File Structure**: Keep files under 250 lines, organize by feature, use workers for concurrent operations
- **Testing**: Use Vitest, mock dependencies, descriptive test names, arrange/act/assert pattern

## Naming Conventions
- PascalCase: Classes, interfaces, types
- camelCase: Variables, functions, methods, file names
- Test files: `[filename].test.ts`

## Key Design Patterns

### Worker Thread Architecture
- CPU-intensive operations (file processing, security checks, metrics) use Piscina worker pools
- **Workers**: `src/core/file/workers/`, `src/core/security/workers/`, `src/core/metrics/workers/`
- Enables concurrent processing while keeping main thread responsive

### Dependency Injection
- Functions accept `deps` object parameter containing dependencies for testability
- Example: `fileCollect(paths, options, deps = { readFile, processFile })`
- Enables easy mocking in tests and flexible runtime configuration

### Configuration System
- **configSchema.ts**: Zod-based type-safe configuration with runtime validation
- **configLoad.ts**: Hierarchical config merging (global → project → CLI options)
- Supports JSON5 format for comments in configuration files

### Error Handling
- All custom errors extend `RepomixError` base class in `src/shared/errorHandle.ts`
- Structured error types with context information for debugging
- Proper error propagation through async/worker boundaries

## Git Workflow
- Follow [Conventional Commits](https://www.conventionalcommits.org/) with scope: `type(scope): Description`
- Write detailed commit messages focusing on the "why" rather than the "what"
- Run `npm run lint && npm test` before committing changes
- Examples: `feat(cli): Add new --no-progress flag`, `fix(security): Handle special characters in file paths`

## Pull Request Review Process

### Viewing PR Comments
There are different types of comments in GitHub PRs that require different approaches to view:

**1. General PR Comments (in main conversation):**
```bash
gh pr view {PR_NUMBER} --comments
```

**2. Specific Code Line Comments (Files changed tab):**
```bash
gh api repos/yamadashy/repomix/pulls/{PR_NUMBER}/comments --jq '.[] | {path: .path, line: .line, body: .body}'
```

**3. Review Comments with Status:**
```bash
gh api repos/yamadashy/repomix/pulls/{PR_NUMBER}/reviews --jq '.[] | select(.state == "COMMENTED" or .state == "CHANGES_REQUESTED") | .body'
```

### Automated Review Bots
This repository uses several automated review tools:

- **CodeRabbit**: AI-powered code review with actionable suggestions
- **Gemini Code Assist**: Google's AI code reviewer with severity ratings (High/Medium/Low)
- **Copilot Pull Request Reviewer**: GitHub's automated review suggestions
- **Codecov**: Test coverage analysis and reporting

### Responding to Review Feedback

**1. Address Technical Issues First:**
- Fix high-priority issues (security, functionality, memory leaks)
- Address medium-priority issues (UX, maintainability)
- Consider low-priority suggestions for future improvements

**2. Commit Changes with Clear Messages:**
```bash
git commit -m "fix(scope): Address PR review feedback

- Fix specific issue 1 (reference commit/line if applicable)
- Improve specific aspect 2
- Address reviewer concern about X

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**3. Respond to Reviewers:**
- Use `gh pr comment {PR_NUMBER} --body "message"` for general responses
- Reference specific commits that address issues: `Fixed in commit \`abc1234\``
- Explain rationale for decisions when not implementing suggestions
- Thank reviewers for their feedback

**4. Resolve Conversations:**
- CodeRabbit: Use `@coderabbitai resolve` command
- Others: Respond with explanation, let reviewers mark as resolved
- GitHub Web UI: Use "Resolve conversation" button on Files changed tab

### Common Review Issues and Solutions

**Vue.js/Frontend:**
- Event listener cleanup: Use `onUnmounted()` instead of return functions in `onMounted()`
- Disabled element events: Move event handlers to parent containers
- CSS positioning: Consider `position: fixed` for tooltips to avoid parent overflow issues
- Accessibility: Maintain ARIA labels and proper focus management

**Performance:**
- Use `{ passive: true }` for scroll listeners
- Implement proper cleanup for all event listeners
- Consider debouncing/throttling for frequent events

**Code Quality:**
- Remove duplicate CSS definitions
- Use existing color schemes for consistency
- Follow established patterns in the codebase
- Maintain proper TypeScript typing
