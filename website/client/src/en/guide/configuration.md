# Configuration

## Quick Start

Create configuration file:
```bash
repomix --init
```

## Configuration Options

| Option                           | Description                                                                                                                  | Default                |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `input.maxFileSize`              | Maximum file size in bytes to process. Files larger than this will be skipped                                                | `50000000`            |
| `output.filePath`                | The name of the output file                                                                                                  | `"repomix-output.xml"` |
| `output.style`                   | The style of the output (`xml`, `markdown`, `plain`)                                                                         | `"xml"`                |
| `output.parsableStyle`           | Whether to escape the output based on the chosen style schema. Note that this can increase token count.                      | `false`                |
| `output.compress`                | Whether to perform intelligent code extraction to reduce token count                                                         | `false`                |
| `output.headerText`              | Custom text to include in the file header                                                                                    | `null`                 |
| `output.instructionFilePath`     | Path to a file containing detailed custom instructions                                                                       | `null`                 |
| `output.fileSummary`             | Whether to include a summary section at the beginning of the output                                                          | `true`                 |
| `output.directoryStructure`      | Whether to include the directory structure in the output                                                                     | `true`                 |
| `output.files`                   | Whether to include file contents in the output                                                                               | `true`                 |
| `output.removeComments`          | Whether to remove comments from supported file types                                                                         | `false`                |
| `output.removeEmptyLines`        | Whether to remove empty lines from the output                                                                                | `false`                |
| `output.showLineNumbers`         | Whether to add line numbers to each line in the output                                                                       | `false`                |
| `output.copyToClipboard`         | Whether to copy the output to system clipboard in addition to saving the file                                                | `false`                |
| `output.topFilesLength`          | Number of top files to display in the summary. If set to 0, no summary will be displayed                                     | `5`                    |
| `output.includeEmptyDirectories` | Whether to include empty directories in the repository structure                                                             | `false`                |
| `output.git.sortByChanges`       | Whether to sort files by git change count (files with more changes appear at the bottom)                                     | `true`                 |
| `output.git.sortByChangesMaxCommits` | Maximum number of commits to analyze for git changes                                                                     | `100`                  |
| `output.git.includeDiffs`       | Whether to include git diffs in the output (includes both work tree and staged changes separately)                          | `false`                |
| `include`                        | Patterns of files to include (using [glob patterns](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax))  | `[]`                   |
| `ignore.useGitignore`            | Whether to use patterns from the project's `.gitignore` file                                                                 | `true`                 |
| `ignore.useDefaultPatterns`      | Whether to use default ignore patterns                                                                                       | `true`                 |
| `ignore.customPatterns`          | Additional patterns to ignore (using [glob patterns](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)) | `[]`                   |
| `security.enableSecurityCheck`   | Whether to perform security checks on files                                                                                  | `true`                 |
| `tokenCount.encoding`            | Token count encoding used by OpenAI's [tiktoken](https://github.com/openai/tiktoken) tokenizer (e.g., `o200k_base` for GPT-4o, `cl100k_base` for GPT-4/3.5). See [tiktoken model.py](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py#L24) for encoding details. | `"o200k_base"`         |

The configuration file supports [JSON5](https://json5.org/) syntax, which allows:
- Comments (both single-line and multi-line)
- Trailing commas in objects and arrays
- Unquoted property names
- More relaxed string syntax

## Example Configuration File

Here's an example of a complete configuration file (`repomix.config.json`):

```json
{
  "input": {
    "maxFileSize": 50000000
  },
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "parsableStyle": false,
    "compress": false,
    "headerText": "Custom header information for the packed file.",
    "fileSummary": true,
    "directoryStructure": true,
    "files": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "includeEmptyDirectories": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": false
    }
  },
  "include": ["**/*"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    // Patterns can also be specified in .repomixignore
    "customPatterns": [
      "additional-folder",
      "**/*.log"
    ],
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
```

## Global Configuration

Create global configuration:
```bash
repomix --init --global
```

Location:
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## Ignore Patterns

Priority:
1. CLI options (`--ignore`)
2. `.repomixignore`
3. `.gitignore` and `.git/info/exclude`
4. Default patterns

Example of `.repomixignore`:
```text
# Cache directories
.cache/
tmp/

# Build outputs
dist/
build/

# Logs
*.log
```

## Default Ignore Patterns

Common patterns included by default:
```text
node_modules/**
.git/**
coverage/**
dist/**
```

Full list: [defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)

## Examples

### Code Compression

When `output.compress` is set to `true`, Repomix will extract essential code structures while removing implementation details. This helps reduce token count while maintaining important structural information.

For more details and examples, see the [Code Compression Guide](code-compress).

### Git Integration

The `output.git` configuration allows you to control how files are sorted based on Git history and how to include Git differences:

- `sortByChanges`: When set to `true`, files are sorted by the number of Git changes (commits that modified the file). Files with more changes appear at the bottom of the output. This helps prioritize more actively developed files. Default: `true`
- `sortByChangesMaxCommits`: The maximum number of commits to analyze when counting file changes. Default: `100`
- `includeDiffs`: When set to `true`, includes Git differences in the output (includes both work tree and staged changes separately). This allows the reader to see pending changes in the repository. Default: `false`

Example configuration:
```json
{
  "output": {
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": true
    }
  }
}
```

### Comment Removal

When `output.removeComments` is set to `true`, comments are removed from supported file types to reduce output size and focus on essential code content.

For supported languages and detailed examples, see the [Comment Removal Guide](comment-removal).
