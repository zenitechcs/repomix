# Befehlszeilenoptionen

## Grundlegende Optionen
- `-v, --version`: Zeigt die Version des Tools an

## Ausgabeoptionen
- `-o, --output <file>`: Name der Ausgabedatei (Standard: `repomix-output.txt`)
- `--style <type>`: Ausgabestil (`plain`, `xml`, `markdown`) (Standard: `plain`)
- `--parsable-style`: Aktiviert analysierbare Ausgabe basierend auf dem gewählten Stilschema (Standard: `false`)
- `--output-show-line-numbers`: Zeilennummern hinzufügen (Standard: `false`)
- `--copy`: In die Zwischenablage kopieren (Standard: `false`)
- `--no-file-summary`: Dateizusammenfassung deaktivieren (Standard: `true`)
- `--no-directory-structure`: Verzeichnisstruktur deaktivieren (Standard: `true`)
- `--remove-comments`: Kommentare entfernen (Standard: `false`)
- `--remove-empty-lines`: Leere Zeilen entfernen (Standard: `false`)
- `--header-text <text>`: Benutzerdefinierten Text im Dateikopf einfügen
- `--instruction-file-path <path>`: Pfad zu einer Datei mit detaillierten benutzerdefinierten Anweisungen
- `--include-empty-directories`: Leere Verzeichnisse in die Ausgabe einschließen (Standard: `false`)

## Filteroptionen
- `--include <patterns>`: Einschlussmuster (durch Kommas getrennt)
- `-i, --ignore <patterns>`: Ignorierungsmuster (durch Kommas getrennt)
- `--no-gitignore`: .gitignore-Dateiverwendung deaktivieren
- `--no-default-patterns`: Standardmuster deaktivieren

## Remote-Repository-Optionen
- `--remote <url>`: Remote-Repository verarbeiten
- `--remote-branch <n>`: Remote-Branch-Namen, Tag oder Commit-Hash angeben (Standard: Repository-Standardbranch)

## Konfigurationsoptionen
- `-c, --config <path>`: Pfad zur benutzerdefinierten Konfigurationsdatei
- `--init`: Konfigurationsdatei erstellen
- `--global`: Globale Konfiguration verwenden

## Sicherheitsoptionen
- `--no-security-check`: Sicherheitsprüfung deaktivieren (Standard: `true`)

## Token-Zählungsoptionen
- `--token-count-encoding <encoding>`: Token-Zählungskodierung angeben (z.B. `o200k_base`, `cl100k_base`) (Standard: `o200k_base`)

## Weitere Optionen
- `--top-files-len <number>`: Anzahl der anzuzeigenden Top-Dateien (Standard: `5`)
- `--verbose`: Ausführliche Protokollierung aktivieren

## Beispiele

```bash
# Grundlegende Verwendung
repomix

# Benutzerdefinierte Ausgabe
repomix -o output.xml --style xml

# Bestimmte Dateien verarbeiten
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# Remote-Repository mit Branch
repomix --remote https://github.com/user/repo/tree/main

# Remote-Repository mit Commit
repomix --remote https://github.com/user/repo/commit/836abcd7335137228ad77feb28655d85712680f1

# Remote-Repository mit Kurzform
repomix --remote user/repo
``` 
