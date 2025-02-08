# Konfiguration

## Schnellstart

Konfigurationsdatei erstellen:
```bash
repomix --init
```

## Konfigurationsdatei

`repomix.config.json`:
```json
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "headerText": "Benutzerdefinierter Kopfzeilentext",
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

## Globale Konfiguration

Globale Konfiguration erstellen:
```bash
repomix --init --global
```

Speicherort:
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## Ignorier-Muster

Prioritätsreihenfolge:
1. CLI-Optionen (`--ignore`)
2. .repomixignore
3. .gitignore
4. Standardmuster

`.repomixignore` Beispiel:
```text
# Cache-Verzeichnisse
.cache/
tmp/

# Build-Ausgaben
dist/
build/

# Protokolle
*.log
```

## Standard-Ignorier-Muster

Standardmäßig enthaltene häufige Muster:
```text
node_modules/**
.git/**
coverage/**
dist/**
```

Vollständige Liste: [defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts) 
