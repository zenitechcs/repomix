# Configuración

## Inicio rápido

Crear archivo de configuración:
```bash
repomix --init
```

## Archivo de configuración

`repomix.config.json`:
```json
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "headerText": "Texto de encabezado personalizado",
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

## Configuración global

Crear configuración global:
```bash
repomix --init --global
```

Ubicación:
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## Patrones de ignorar

Orden de prioridad:
1. Opciones de CLI (`--ignore`)
2. .repomixignore
3. .gitignore
4. Patrones predeterminados

Ejemplo de `.repomixignore`:
```text
# Directorios de caché
.cache/
tmp/

# Salidas de compilación
dist/
build/

# Registros
*.log
```

## Patrones de ignorar predeterminados

Patrones comunes incluidos por defecto:
```text
node_modules/**
.git/**
coverage/**
dist/**
```

Lista completa: [defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)
