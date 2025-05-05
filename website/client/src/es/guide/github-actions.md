# Usar Repomix con GitHub Actions

Puedes automatizar el empaquetado de tu base de código para análisis por IA integrando Repomix en tus flujos de trabajo de GitHub Actions. Esto es útil para integración continua (CI), revisión de código o preparación para herramientas LLM.

## Uso básico

Agrega el siguiente paso a tu archivo YAML de workflow para empaquetar tu repositorio:

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    include: "**/*.ts"
    output: repomix-output.txt
```

## Empaquetar múltiples directorios con compresión

Puedes especificar múltiples directorios, patrones de inclusión/exclusión y habilitar la compresión inteligente:

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src tests
    include: "**/*.ts,**/*.md"
    ignore: "**/*.test.ts"
    output: repomix-output.txt
    compress: true
```

## Subir el archivo de salida como artefacto

Para que el archivo empaquetado esté disponible para pasos posteriores o para descarga, súbelo como artefacto:

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    output: repomix-output.txt
    compress: true

- name: Upload Repomix output
  uses: actions/upload-artifact@v4
  with:
    name: repomix-output
    path: repomix-output.txt
```

## Parámetros de entrada de la Action

| Nombre             | Descripción                                 | Predeterminado    |
|--------------------|---------------------------------------------|-------------------|
| `directories`      | Lista de directorios a empaquetar (separados por espacio) | `.`         |
| `include`          | Patrones glob a incluir (separados por coma) | `""`         |
| `ignore`           | Patrones glob a excluir (separados por coma) | `""`         |
| `output`           | Ruta del archivo de salida                   | `repomix.txt`     |
| `compress`         | Habilitar compresión inteligente             | `true`            |
| `additional-args`  | Argumentos extra para repomix CLI            | `""`         |
| `repomix-version`  | Versión del paquete npm a instalar           | `latest`          |

## Salidas de la Action

| Nombre         | Descripción                        |
|---------------|------------------------------------|
| `output_file` | Ruta del archivo generado           |

## Ejemplo de workflow completo

Aquí tienes un ejemplo completo de workflow de GitHub Actions usando Repomix:

```yaml
name: Pack and Upload Codebase
on:
  push:
    branches: [main]

jobs:
  pack:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Pack repository with Repomix
        uses: yamadashy/repomix/.github/actions/repomix@main
        with:
          directories: src
          include: "**/*.ts"
          output: repomix-output.txt
          compress: true
      - name: Upload Repomix output
        uses: actions/upload-artifact@v4
        with:
          name: repomix-output
          path: repomix-output.txt
``` 
