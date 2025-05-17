# Configuración

## Inicio rápido

Crear archivo de configuración:
```bash
repomix --init
```

## Opciones de configuración

| Opción                           | Descripción                                                                                                                  | Valor predeterminado   |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `input.maxFileSize`              | Tamaño máximo de archivo en bytes a procesar. Los archivos más grandes serán omitidos                                        | `50000000`            |
| `output.filePath`                | Nombre del archivo de salida                                                                                                 | `"repomix-output.xml"` |
| `output.style`                   | Estilo de salida (`xml`, `markdown`, `plain`)                                                                                | `"xml"`                |
| `output.parsableStyle`           | Si la salida debe ser escapada según el esquema de estilo elegido. Tenga en cuenta que esto puede aumentar el conteo de tokens | `false`                |
| `output.compress`                | Si se debe realizar una extracción inteligente de código para reducir el conteo de tokens                                    | `false`                |
| `output.headerText`              | Texto personalizado para incluir en el encabezado del archivo                                                                | `null`                 |
| `output.instructionFilePath`     | Ruta a un archivo que contiene instrucciones personalizadas detalladas                                                       | `null`                 |
| `output.fileSummary`             | Si se debe incluir una sección de resumen al principio de la salida                                                         | `true`                 |
| `output.directoryStructure`      | Si se debe incluir la estructura de directorios en la salida                                                                | `true`                 |
| `output.files`                   | Si se debe incluir el contenido de los archivos en la salida                                                                | `true`                 |
| `output.removeComments`          | Si se deben eliminar los comentarios de los tipos de archivos soportados                                                    | `false`                |
| `output.removeEmptyLines`        | Si se deben eliminar las líneas vacías de la salida                                                                         | `false`                |
| `output.showLineNumbers`         | Si se deben agregar números de línea a cada línea                                                                           | `false`                |
| `output.copyToClipboard`         | Si la salida debe copiarse al portapapeles del sistema además de guardarse                                                  | `false`                |
| `output.topFilesLength`          | Número de archivos principales a mostrar en el resumen. Si se establece en 0, no se mostrará el resumen                    | `5`                    |
| `output.includeEmptyDirectories` | Si se deben incluir directorios vacíos en la estructura del repositorio                                                     | `false`                |
| `output.git.sortByChanges`       | Si los archivos deben ordenarse por número de cambios Git (los archivos con más cambios aparecen al final)                 | `true`                 |
| `output.git.sortByChangesMaxCommits` | Número máximo de commits a analizar para los cambios Git                                                                | `100`                  |
| `output.git.includeDiffs`        | Si se deben incluir las diferencias Git en la salida (incluye por separado los cambios del árbol de trabajo y del área de preparación) | `false`                |
| `include`                        | Patrones de archivos a incluir (usa [patrones glob](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)) | `[]`                   |
| `ignore.useGitignore`            | Si se deben usar los patrones del archivo `.gitignore` del proyecto                                                         | `true`                 |
| `ignore.useDefaultPatterns`      | Si se deben usar los patrones de ignorar predeterminados                                                                    | `true`                 |
| `ignore.customPatterns`          | Patrones adicionales para ignorar (usa [patrones glob](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)) | `[]`                   |
| `security.enableSecurityCheck`   | Si se deben realizar comprobaciones de seguridad en los archivos                                                            | `true`                 |
| `tokenCount.encoding`            | Codificación de conteo de tokens utilizada por el tokenizador [tiktoken](https://github.com/openai/tiktoken) de OpenAI (por ejemplo, `o200k_base` para GPT-4o, `cl100k_base` para GPT-4/3.5). Ver [tiktoken model.py](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py#L24) para más detalles. | `"o200k_base"`         |

El archivo de configuración admite la sintaxis [JSON5](https://json5.org/), que permite:
- Comentarios (de una línea y multilínea)
- Comas finales en objetos y arrays
- Nombres de propiedades sin comillas
- Sintaxis de cadena más flexible

## Ejemplo de archivo de configuración

Aquí hay un ejemplo de un archivo de configuración completo (`repomix.config.json`):

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
    "headerText": "Información de encabezado personalizada para el archivo empaquetado",
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
    // Los patrones también se pueden especificar en .repomixignore
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

## Configuración global

Crear configuración global:
```bash
repomix --init --global
```

Ubicación:
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## Patrones de ignorar

Prioridad:
1. Opciones CLI (`--ignore`)
2. `.repomixignore`
3. `.gitignore` y `.git/info/exclude`
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

## Ejemplos

### Compresión de código

Cuando `output.compress` se establece en `true`, Repomix extrae las estructuras de código esenciales mientras elimina los detalles de implementación. Esto ayuda a reducir el conteo de tokens mientras mantiene la información estructural importante.

Para más detalles y ejemplos, consulte la [Guía de compresión de código](code-compress).

### Integración Git

La configuración `output.git` le permite controlar cómo se ordenan los archivos según el historial de Git y cómo incluir las diferencias de Git:

- `sortByChanges`: Cuando se establece en `true`, los archivos se ordenan por número de cambios Git (commits que modificaron el archivo). Los archivos con más cambios aparecen al final de la salida. Esto ayuda a priorizar los archivos más activamente desarrollados. Valor predeterminado: `true`
- `sortByChangesMaxCommits`: Número máximo de commits a analizar al contar los cambios de archivos. Valor predeterminado: `100`
- `includeDiffs`: Cuando se establece en `true`, incluye las diferencias Git en la salida (incluye por separado los cambios del árbol de trabajo y del área de preparación). Esto permite al lector ver los cambios pendientes en el repositorio. Valor predeterminado: `false`

Ejemplo de configuración:
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

### Eliminación de comentarios

Cuando `output.removeComments` se establece en `true`, los comentarios se eliminan de los tipos de archivos soportados para reducir el tamaño de la salida y centrarse en el contenido esencial del código.

Para los lenguajes soportados y ejemplos detallados, consulte la [Guía de eliminación de comentarios](comment-removal).
