# Output Formats

Repomix supports three output formats:
- XML (default)
- Markdown
- Plain Text 

## XML Format

```bash
repomix --style xml
```

XML format is optimized for AI processing:

```xml
This file is a merged representation of the entire codebase...

<file_summary>
(Metadata and AI instructions)
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// File contents here
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
```

::: tip Why XML?
XML tags help AI models like Claude parse content more accurately. [Claude Documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags) recommends using XML tags for structured prompts.
:::

## Markdown Format

```bash
repomix --style markdown
```

Markdown provides readable formatting:

```markdown
This file is a merged representation of the entire codebase...

# File Summary
(Metadata and AI instructions)

# Directory Structure
```
src/
index.ts
utils/
helper.ts
```

# Files

## File: src/index.ts
```typescript
// File contents here
```

# Git Logs
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
```

## Usage with AI Models

Each format works well with AI models, but consider:
- Use XML for Claude (best parsing accuracy)
- Use Markdown for general readability
- Use Plain Text for simplicity and universal compatibility

## Customization

Set default format in `repomix.config.json`:
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## Plain Text Format

```bash
repomix --style plain
```

Output structure:
```text
This file is a merged representation of the entire codebase...

================
File Summary
================
(Metadata and AI instructions)

================
Directory Structure
================
src/
  index.ts
  utils/
    helper.ts

================
Files
================

================
File: src/index.ts
================
// File contents here

================
Git Logs
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
