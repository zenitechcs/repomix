# Configuration

## Quick Start

Create configuration file:
```bash
repomix --init
```

## Configuration File

`repomix.config.json`:
```json
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "headerText": "Custom header text",
    "instructionFilePath": "repomix-instruction.md",
    "fileSummary": true,
    "directoryStructure": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "includeEmptyDirectories": false
  },
  "include": ["**/*"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": ["tmp/", "*.log"]
  },
  "security": {
    "enableSecurityCheck": true
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

Priority order:
1. CLI options (`--ignore`)
2. .repomixignore
3. .gitignore
4. Default patterns

`.repomixignore` example:
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
