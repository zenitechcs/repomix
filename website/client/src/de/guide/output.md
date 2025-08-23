# Ausgabeformate

Repomix unterstützt drei Ausgabeformate:
- XML (Standard)
- Markdown
- Klartext

## XML-Format

```bash
repomix --style xml
```

Das XML-Format ist für die KI-Verarbeitung optimiert:

::: tip Warum XML?
XML-Tags helfen KI-Modellen wie Claude, Inhalte genauer zu analysieren. Die [Claude-Dokumentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags) empfiehlt die Verwendung von XML-Tags für strukturierte Prompts.
:::

```xml
Diese Datei ist eine zusammengeführte Darstellung der gesamten Codebasis...

<file_summary>
(Metadaten und KI-Anweisungen)
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// Dateiinhalt hier
</file>
</files>

<git_logs>
2025-08-20 00:47:19 +0900|feat(cli): Add --include-logs option for git commit history
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts

2025-08-21 00:09:43 +0900|Merge pull request #795 from yamadashy/chore/ratchet-update-ci
.github/workflows/ratchet-update.yml
</git_logs>

## Markdown-Format

```bash
repomix --style markdown
```

Markdown bietet lesbare Formatierung:

```markdown
Diese Datei ist eine zusammengeführte Darstellung der gesamten Codebasis...

# Dateizusammenfassung
(Metadaten und KI-Anweisungen)

# Verzeichnisstruktur
```text
src/
  index.ts
  utils/
    helper.ts
```

# Dateien

## Datei: src/index.ts
```typescript
// Dateiinhalt hier
```

# Git-Logs
```
2025-08-20 00:47:19 +0900|feat(cli): Add --include-logs option for git commit history
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts

2025-08-21 00:09:43 +0900|Merge pull request #795 from yamadashy/chore/ratchet-update-ci
.github/workflows/ratchet-update.yml
``` 

## Klartext-Format

```bash
repomix --style plain
```

Ausgabestruktur:
```text
Diese Datei ist eine zusammengeführte Darstellung der gesamten Codebasis...

================
Dateizusammenfassung
================
(Metadaten und KI-Anweisungen)

================
Verzeichnisstruktur
================
src/
  index.ts
  utils/
    helper.ts

================
Dateien
================

================
Datei: src/index.ts
================
// Dateiinhalt hier

================
Git-Logs
================
2025-08-20 00:47:19 +0900|feat(cli): Add --include-logs option for git commit history
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts

2025-08-21 00:09:43 +0900|Merge pull request #795 from yamadashy/chore/ratchet-update-ci
.github/workflows/ratchet-update.yml
```
