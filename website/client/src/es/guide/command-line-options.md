# Opciones de línea de comandos

## Opciones básicas

```bash
repomix [directorio]  # Procesa un directorio específico (por defecto: ".")
```

## Opciones de salida

| Opción | Descripción | Predeterminado |
|--------|-------------|---------|
| `-o, --output <archivo>` | Nombre del archivo de salida | `repomix-output.txt` |
| `--style <tipo>` | Estilo de salida (`plain`, `xml`, `markdown`) | `plain` |
| `--output-show-line-numbers` | Añadir números de línea | `false` |
| `--copy` | Copiar al portapapeles | `false` |
| `--no-file-summary` | Desactivar el resumen de archivos | `true` |
| `--no-directory-structure` | Desactivar la estructura de directorios | `true` |
| `--remove-comments` | Eliminar comentarios | `false` |
| `--remove-empty-lines` | Eliminar líneas vacías | `false` |

## Opciones de filtrado

| Opción | Descripción |
|--------|-------------|
| `--include <patrones>` | Patrones a incluir (separados por comas) |
| `-i, --ignore <patrones>` | Patrones a ignorar (separados por comas) |

## Repositorio remoto

| Opción | Descripción |
|--------|-------------|
| `--remote <url>` | Procesar un repositorio remoto |
| `--remote-branch <nombre>` | Especificar rama/etiqueta/commit |

## Configuración

| Opción | Descripción |
|--------|-------------|
| `-c, --config <ruta>` | Ruta al archivo de configuración personalizado |
| `--init` | Crear archivo de configuración |
| `--global` | Usar configuración global |

## Seguridad

| Opción | Descripción | Predeterminado |
|--------|-------------|---------|
| `--no-security-check` | Desactivar la comprobación de seguridad | `true` |

## Otras opciones

| Opción | Descripción |
|--------|-------------|
| `-v, --version` | Mostrar versión |
| `--verbose` | Habilitar el registro detallado |
| `--top-files-len <número>` | Número de archivos principales a mostrar | `5` |

## Ejemplos

```bash
# Uso básico
repomix

# Salida personalizada
repomix -o salida.xml --style xml

# Procesar archivos específicos
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# Repositorio remoto
repomix --remote usuario/repositorio --remote-branch main
