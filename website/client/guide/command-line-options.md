# Command Line Options

## Basic Options

```bash
repomix [directory]  # Process specific directory (default: ".")
```

## Output Options

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output <file>` | Output file name | `repomix-output.txt` |
| `--style <type>` | Output style (`plain`, `xml`, `markdown`) | `plain` |
| `--output-show-line-numbers` | Add line numbers | `false` |
| `--copy` | Copy to clipboard | `false` |
| `--no-file-summary` | Disable file summary | `true` |
| `--no-directory-structure` | Disable directory structure | `true` |
| `--remove-comments` | Remove comments | `false` |
| `--remove-empty-lines` | Remove empty lines | `false` |

## Filter Options

| Option | Description |
|--------|-------------|
| `--include <patterns>` | Include patterns (comma-separated) |
| `-i, --ignore <patterns>` | Ignore patterns (comma-separated) |

## Remote Repository

| Option | Description |
|--------|-------------|
| `--remote <url>` | Process remote repository |
| `--remote-branch <name>` | Specify branch/tag/commit |

## Configuration

| Option | Description |
|--------|-------------|
| `-c, --config <path>` | Custom config file path |
| `--init` | Create config file |
| `--global` | Use global config |

## Security

| Option | Description | Default |
|--------|-------------|---------|
| `--no-security-check` | Disable security check | `true` |

## Other Options

| Option | Description |
|--------|-------------|
| `-v, --version` | Show version |
| `--verbose` | Enable verbose logging |
| `--top-files-len <number>` | Number of top files to show | `5` |

## Examples

```bash
# Basic usage
repomix

# Custom output
repomix -o output.xml --style xml

# Process specific files
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# Remote repository
repomix --remote user/repo --remote-branch main
```
