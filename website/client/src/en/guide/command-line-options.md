# Command Line Options

## Basic Options
- `-v, --version`: show version information and exit

## CLI Input/Output Options
- `--verbose`: enable detailed debug logging (shows file processing, token counts, and configuration details)
- `--quiet`: suppress all console output except errors (useful for scripting)
- `--stdout`: write packed output directly to stdout instead of a file (suppresses all logging)
- `--stdin`: read file paths from stdin, one per line (specified files are processed directly)
- `--copy`: copy the generated output to system clipboard after processing
- `--token-count-tree [threshold]`: show file tree with token counts; optional threshold to show only files with ≥N tokens (e.g., --token-count-tree 100)
- `--top-files-len <number>`: number of largest files to show in summary (default: 5, e.g., --top-files-len 20)

## Repomix Output Options
- `-o, --output <file>`: output file path (default: repomix-output.xml, use "-" for stdout)
- `--style <type>`: output format: xml, markdown, or plain (default: xml)
- `--parsable-style`: escape special characters to ensure valid XML/Markdown (needed when output contains code that breaks formatting)
- `--compress`: extract essential code structure (classes, functions, interfaces) using Tree-sitter parsing
- `--output-show-line-numbers`: prefix each line with its line number in the output
- `--no-file-summary`: omit the file summary section from output
- `--no-directory-structure`: omit the directory tree visualization from output
- `--no-files`: generate metadata only without file contents (useful for repository analysis)
- `--remove-comments`: strip all code comments before packing
- `--remove-empty-lines`: remove blank lines from all files
- `--truncate-base64`: truncate long base64 data strings to reduce output size
- `--header-text <text>`: custom text to include at the beginning of the output
- `--instruction-file-path <path>`: path to file containing custom instructions to include in output
- `--include-empty-directories`: include folders with no files in directory structure
- `--no-git-sort-by-changes`: don't sort files by git change frequency (default: most changed files first)
- `--include-diffs`: add git diff section showing working tree and staged changes
- `--include-logs`: add git commit history with messages and changed files
- `--include-logs-count <count>`: number of recent commits to include with --include-logs (default: 50)

## File Selection Options
- `--include <patterns>`: include only files matching these glob patterns (comma-separated, e.g., "src/**/*.js,*.md")
- `-i, --ignore <patterns>`: additional patterns to exclude (comma-separated, e.g., "*.test.js,docs/**")
- `--no-gitignore`: don't use .gitignore rules for filtering files
- `--no-default-patterns`: don't apply built-in ignore patterns (node_modules, .git, build dirs, etc.)

## Remote Repository Options
- `--remote <url>`: clone and pack a remote repository (GitHub URL or user/repo format)
- `--remote-branch <name>`: specific branch, tag, or commit to use (default: repository's default branch)

## Configuration Options
- `-c, --config <path>`: use custom config file instead of repomix.config.json
- `--init`: create a new repomix.config.json file with defaults
- `--global`: with --init, create config in home directory instead of current directory

## Security Options
- `--no-security-check`: skip scanning for sensitive data like API keys and passwords

## Token Count Options
- `--token-count-encoding <encoding>`: tokenizer model for counting: o200k_base (GPT-4o), cl100k_base (GPT-3.5/4), etc. (default: o200k_base)

## MCP Options
- `--mcp`: run as Model Context Protocol server for AI tool integration
## Examples

```bash
# Basic usage
repomix

# Custom output file and format
repomix -o my-output.xml --style xml

# Output to stdout
repomix --stdout > custom-output.txt

# Send output to stdout, then pipe into another command (for example, simonw/llm)
repomix --stdout | llm "Please explain what this code does."

# Custom output with compression
repomix --compress

# Process specific files with patterns
repomix --include "src/**/*.ts,*.md" --ignore "*.test.js,docs/**"

# Remote repository with branch
repomix --remote https://github.com/user/repo/tree/main

# Remote repository with commit
repomix --remote https://github.com/user/repo/commit/836abcd7335137228ad77feb28655d85712680f1

# Remote repository with shorthand
repomix --remote user/repo

# Using stdin for file list
find src -name "*.ts" -type f | repomix --stdin
git ls-files "*.js" | repomix --stdin
echo -e "src/index.ts\nsrc/utils.ts" | repomix --stdin

# Git integration
repomix --include-diffs  # Include git diffs for uncommitted changes
repomix --include-logs   # Include git logs (last 50 commits by default)
repomix --include-logs --include-logs-count 10  # Include last 10 commits
repomix --include-diffs --include-logs  # Include both diffs and logs

# Token count analysis
repomix --token-count-tree
repomix --token-count-tree 1000  # Only show files/directories with 1000+ tokens
```

