# Configuração

## Início Rápido

Criar arquivo de configuração:
```bash
repomix --init
```

## Arquivo de Configuração

`repomix.config.json`:
```json
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "headerText": "Texto de cabeçalho personalizado",
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

## Configuração Global

Criar configuração global:
```bash
repomix --init --global
```

Localização:
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## Padrões de Exclusão

Ordem de prioridade:
1. Opções de CLI (`--ignore`)
2. .repomixignore
3. .gitignore
4. Padrões padrão

Exemplo de `.repomixignore`:
```text
# Diretórios de cache
.cache/
tmp/

# Saídas de build
dist/
build/

# Logs
*.log
```

## Padrões de Exclusão Padrão

Padrões comuns incluídos por padrão:
```text
node_modules/**
.git/**
coverage/**
dist/**
```

Lista completa: [defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)
