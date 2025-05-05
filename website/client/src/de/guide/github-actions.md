# Verwendung von Repomix mit GitHub Actions

Sie können den Verpackungsprozess Ihres Codebases für die KI-Analyse automatisieren, indem Sie Repomix in Ihre GitHub Actions Workflows integrieren. Dies ist nützlich für Continuous Integration (CI), Code-Reviews oder die Vorbereitung für LLM-Tools.

## Grundlegende Nutzung

Fügen Sie den folgenden Schritt zu Ihrer Workflow-YAML-Datei hinzu, um Ihr Repository zu verpacken:

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    include: "**/*.ts"
    output: repomix-output.txt
```

## Mehrere Verzeichnisse mit Komprimierung verpacken

Sie können mehrere Verzeichnisse, Include-/Exclude-Patterns und intelligente Komprimierung angeben:

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

## Ausgabedatei als Artefakt hochladen

Um die verpackte Datei für nachfolgende Schritte oder zum Download bereitzustellen, laden Sie sie als Artefakt hoch:

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

## Action-Eingabeparameter

| Name               | Beschreibung                                 | Standardwert      |
|--------------------|----------------------------------------------|-------------------|
| `directories`      | Zu verpackende Verzeichnisse (Leerzeichen-getrennt) | `.`         |
| `include`          | Einzuschließende Glob-Patterns (kommagetrennt) | `""`         |
| `ignore`           | Auszuschließende Glob-Patterns (kommagetrennt) | `""`         |
| `output`           | Pfad der Ausgabedatei                         | `repomix.txt`     |
| `compress`         | Intelligente Komprimierung aktivieren          | `true`            |
| `additional-args`  | Zusätzliche Argumente für repomix CLI          | `""`         |
| `repomix-version`  | Zu installierende npm-Paketversion             | `latest`          |

## Action-Ausgaben

| Name          | Beschreibung                        |
|---------------|-------------------------------------|
| `output_file` | Pfad zur generierten Ausgabedatei    |

## Komplettes Workflow-Beispiel

Hier ein vollständiges Beispiel für einen GitHub Actions Workflow mit Repomix:

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
