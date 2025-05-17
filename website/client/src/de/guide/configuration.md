# Konfiguration

## Schnellstart

Konfigurationsdatei erstellen:
```bash
repomix --init
```

## Konfigurationsoptionen

| Option                           | Beschreibung                                                                                                                | Standardwert           |
|----------------------------------|-----------------------------------------------------------------------------------------------------------------------------|------------------------|
| `input.maxFileSize`              | Maximale Dateigröße in Bytes für die Verarbeitung. Größere Dateien werden übersprungen                                      | `50000000`            |
| `output.filePath`                | Name der Ausgabedatei                                                                                                       | `"repomix-output.xml"` |
| `output.style`                   | Ausgabestil (`xml`, `markdown`, `plain`)                                                                                    | `"xml"`                |
| `output.parsableStyle`           | Ob die Ausgabe gemäß dem gewählten Stilschema maskiert werden soll. Beachten Sie, dass dies die Token-Anzahl erhöhen kann  | `false`                |
| `output.compress`                | Ob eine intelligente Code-Extraktion zur Reduzierung der Token-Anzahl durchgeführt werden soll                              | `false`                |
| `output.headerText`              | Benutzerdefinierter Text für den Dateikopf                                                                                  | `null`                 |
| `output.instructionFilePath`     | Pfad zu einer Datei mit detaillierten benutzerdefinierten Anweisungen                                                      | `null`                 |
| `output.fileSummary`             | Ob ein Zusammenfassungsabschnitt am Anfang der Ausgabe enthalten sein soll                                                 | `true`                 |
| `output.directoryStructure`      | Ob die Verzeichnisstruktur in der Ausgabe enthalten sein soll                                                              | `true`                 |
| `output.files`                   | Ob Dateiinhalte in der Ausgabe enthalten sein sollen                                                                       | `true`                 |
| `output.removeComments`          | Ob Kommentare aus unterstützten Dateitypen entfernt werden sollen                                                          | `false`                |
| `output.removeEmptyLines`        | Ob leere Zeilen aus der Ausgabe entfernt werden sollen                                                                     | `false`                |
| `output.showLineNumbers`         | Ob Zeilennummern zu jeder Zeile hinzugefügt werden sollen                                                                  | `false`                |
| `output.copyToClipboard`         | Ob die Ausgabe zusätzlich zum Speichern in die Systemzwischenablage kopiert werden soll                                   | `false`                |
| `output.topFilesLength`          | Anzahl der in der Zusammenfassung anzuzeigenden Top-Dateien. Bei 0 wird keine Zusammenfassung angezeigt                    | `5`                    |
| `output.includeEmptyDirectories` | Ob leere Verzeichnisse in der Repository-Struktur enthalten sein sollen                                                    | `false`                |
| `output.git.sortByChanges`       | Ob Dateien nach Git-Änderungshäufigkeit sortiert werden sollen (häufiger geänderte Dateien erscheinen unten)              | `true`                 |
| `output.git.sortByChangesMaxCommits` | Maximale Anzahl der zu analysierenden Commits für Git-Änderungen                                                       | `100`                  |
| `output.git.includeDiffs`        | Ob Git-Unterschiede in der Ausgabe enthalten sein sollen (enthält Arbeitsverzeichnis- und Stage-Änderungen separat)        | `false`                |
| `include`                        | Muster für einzuschließende Dateien (verwendet [glob-Muster](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)) | `[]`                   |
| `ignore.useGitignore`            | Ob Muster aus der `.gitignore`-Datei des Projekts verwendet werden sollen                                                  | `true`                 |
| `ignore.useDefaultPatterns`      | Ob Standard-Ignorierungsmuster verwendet werden sollen                                                                      | `true`                 |
| `ignore.customPatterns`          | Zusätzliche Ignorierungsmuster (verwendet [glob-Muster](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)) | `[]`                   |
| `security.enableSecurityCheck`   | Ob Sicherheitsprüfungen für Dateien durchgeführt werden sollen                                                             | `true`                 |
| `tokenCount.encoding`            | Token-Zählungs-Encoding, das vom OpenAI [tiktoken](https://github.com/openai/tiktoken) Tokenizer verwendet wird (z.B. `o200k_base` für GPT-4o, `cl100k_base` für GPT-4/3.5). Siehe [tiktoken model.py](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py#L24) für Details. | `"o200k_base"`         |

Die Konfigurationsdatei unterstützt die [JSON5](https://json5.org/)-Syntax, die Folgendes erlaubt:
- Kommentare (einzeilig und mehrzeilig)
- Nachfolgende Kommas in Objekten und Arrays
- Unquotierte Eigenschaftsnamen
- Flexiblere String-Syntax

## Beispiel-Konfigurationsdatei

Hier ist ein Beispiel einer vollständigen Konfigurationsdatei (`repomix.config.json`):

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
    "headerText": "Benutzerdefinierte Header-Informationen für die gepackte Datei",
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
    // Muster können auch in .repomixignore angegeben werden
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

## Globale Konfiguration

Globale Konfiguration erstellen:
```bash
repomix --init --global
```

Speicherort:
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## Ignorierungsmuster

Priorität:
1. CLI-Optionen (`--ignore`)
2. `.repomixignore`
3. `.gitignore` und `.git/info/exclude`
4. Standardmuster

Beispiel für `.repomixignore`:
```text
# Cache-Verzeichnisse
.cache/
tmp/

# Build-Ausgaben
dist/
build/

# Logs
*.log
```

## Standard-Ignorierungsmuster

Häufig verwendete Muster, die standardmäßig enthalten sind:
```text
node_modules/**
.git/**
coverage/**
dist/**
```

Vollständige Liste: [defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)

## Beispiele

### Code-Komprimierung

Wenn `output.compress` auf `true` gesetzt ist, extrahiert Repomix wesentliche Code-Strukturen und entfernt dabei Implementierungsdetails. Dies hilft, die Token-Anzahl zu reduzieren, während wichtige strukturelle Informationen erhalten bleiben.

Weitere Details und Beispiele finden Sie im [Code-Komprimierungs-Leitfaden](code-compress).

### Git-Integration

Die `output.git`-Konfiguration ermöglicht es Ihnen zu steuern, wie Dateien basierend auf Git-Historie sortiert werden und wie Git-Unterschiede einbezogen werden:

- `sortByChanges`: Wenn auf `true` gesetzt, werden Dateien nach der Anzahl der Git-Änderungen (Commits, die die Datei geändert haben) sortiert. Dateien mit mehr Änderungen erscheinen am Ende der Ausgabe. Dies hilft, aktiver entwickelte Dateien zu priorisieren. Standardwert: `true`
- `sortByChangesMaxCommits`: Maximale Anzahl der zu analysierenden Commits beim Zählen von Dateiänderungen. Standardwert: `100`
- `includeDiffs`: Wenn auf `true` gesetzt, werden Git-Unterschiede in die Ausgabe einbezogen (enthält sowohl Arbeitsverzeichnis- als auch Stage-Änderungen separat). Dies ermöglicht es dem Leser, ausstehende Änderungen im Repository zu sehen. Standardwert: `false`

Beispielkonfiguration:
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

### Kommentarentfernung

Wenn `output.removeComments` auf `true` gesetzt ist, werden Kommentare aus unterstützten Dateitypen entfernt, um die Ausgabegröße zu reduzieren und sich auf den wesentlichen Code-Inhalt zu konzentrieren.

Informationen zu unterstützten Sprachen und detaillierte Beispiele finden Sie im [Kommentarentfernungs-Leitfaden](comment-removal).
