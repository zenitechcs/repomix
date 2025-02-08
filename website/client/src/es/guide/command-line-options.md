# Opciones de línea de comandos

## Opciones básicas
- `-v, --version`: Mostrar versión

## Opciones de salida
- `-o, --output <file>`: Nombre del archivo de salida (valor predeterminado: `repomix-output.txt`)
- `--style <type>`: Formato de salida (`plain`, `xml`, `markdown`) (valor predeterminado: `plain`)
- `--parsable-style`: Habilitar salida analizable basada en el esquema de estilo seleccionado (valor predeterminado: `false`)
- `--output-show-line-numbers`: Agregar números de línea (valor predeterminado: `false`)
- `--copy`: Copiar al portapapeles (valor predeterminado: `false`)
- `--no-file-summary`: Deshabilitar resumen de archivos (valor predeterminado: `true`)
- `--no-directory-structure`: Deshabilitar estructura de directorios (valor predeterminado: `true`)
- `--remove-comments`: Eliminar comentarios (valor predeterminado: `false`)
- `--remove-empty-lines`: Eliminar líneas vacías (valor predeterminado: `false`)
- `--header-text <text>`: Texto personalizado para incluir en el encabezado del archivo
- `--instruction-file-path <path>`: Ruta al archivo con instrucciones personalizadas detalladas
- `--include-empty-directories`: Incluir directorios vacíos en la salida (valor predeterminado: `false`)

## Opciones de filtro
- `--include <patterns>`: Patrones de inclusión (separados por comas)
- `-i, --ignore <patterns>`: Patrones de exclusión (separados por comas)
- `--no-gitignore`: Deshabilitar el uso del archivo .gitignore
- `--no-default-patterns`: Deshabilitar patrones predeterminados

## Opciones de repositorio remoto
- `--remote <url>`: Procesar repositorio remoto
- `--remote-branch <name>`: Especificar nombre de rama remota, etiqueta o hash de commit (valor predeterminado es la rama predeterminada del repositorio)

## Opciones de configuración
- `-c, --config <path>`: Ruta del archivo de configuración personalizado
- `--init`: Crear archivo de configuración
- `--global`: Usar configuración global

## Opciones de seguridad
- `--no-security-check`: Deshabilitar verificación de seguridad (valor predeterminado: `true`)

## Opciones de conteo de tokens
- `--token-count-encoding <encoding>`: Especificar codificación para conteo de tokens (ej: `o200k_base`, `cl100k_base`) (valor predeterminado: `o200k_base`)

## Otras opciones
- `--top-files-len <number>`: Número de archivos principales a mostrar (valor predeterminado: `5`)
- `--verbose`: Habilitar registro detallado

## Ejemplos de uso

```bash
# Uso básico
repomix

# Salida personalizada
repomix -o output.xml --style xml

# Procesar archivos específicos
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# Repositorio remoto con rama específica
repomix --remote https://github.com/user/repo/tree/main

# Repositorio remoto con commit específico
repomix --remote https://github.com/user/repo/commit/836abcd7335137228ad77feb28655d85712680f1

# Formato abreviado de repositorio remoto
repomix --remote user/repo
