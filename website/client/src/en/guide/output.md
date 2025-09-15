# Output Formats

Repomix supports four output formats:
- XML (default)
- Markdown
- JSON
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

### Why XML as Default Format?
Repomix uses XML as the default output format based on extensive research and testing. This decision is grounded in both empirical evidence and practical considerations for AI-assisted code analysis.

Our choice of XML is primarily influenced by official recommendations from major AI providers:
- **Anthropic (Claude)**: Explicitly recommends XML tags for structuring prompts, stating that "Claude was exposed to such prompts during training" ([source](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags))
- **Google (Gemini)**: Recommends structured formats including XML for complex tasks ([documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts))
- **OpenAI (GPT)**: Advocates for structured prompting in complex scenarios ([announcement](https://x.com/OpenAIDevs/status/1890147300493914437), [cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide))

## Markdown Format

```bash
repomix --style markdown
```

Markdown provides readable formatting:

````markdown
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
````

## JSON Format

```bash
repomix --style json
```

JSON format provides structured, programmatically accessible output with camelCase property names:

```json
{
  "fileSummary": {
    "generationHeader": "This file is a merged representation of the entire codebase, combined into a single document by Repomix.",
    "purpose": "This file contains a packed representation of the entire repository's contents...",
    "fileFormat": "The content is organized as follows...",
    "usageGuidelines": "- This file should be treated as read-only...",
    "notes": "- Some files may have been excluded based on .gitignore rules..."
  },
  "userProvidedHeader": "Custom header text if specified",
  "directoryStructure": "src/
  cli/
    cliOutput.ts
    index.ts
  config/
    configLoader.ts",
  "files": {
    "src/index.js": "// File contents here",
    "src/utils.js": "// File contents here"
  },
  "instruction": "Custom instructions from instructionFilePath"
}
```

### Benefits of JSON Format

The JSON format is ideal for:
- **Programmatic processing**: Easy to parse and manipulate with JSON libraries in any programming language
- **API integration**: Direct consumption by web services and applications  
- **AI tool compatibility**: Structured format optimized for machine learning and AI systems
- **Data analysis**: Straightforward extraction of specific information using tools like `jq`

### Working with JSON Output Using `jq`

The JSON format makes it easy to extract specific information programmatically. Here are common examples:

#### Basic File Operations
```bash
# List all file paths
cat repomix-output.json | jq -r '.files | keys[]'

# Count total number of files
cat repomix-output.json | jq '.files | keys | length'

# Extract specific file content
cat repomix-output.json | jq -r '.files["README.md"]'
cat repomix-output.json | jq -r '.files["src/index.js"]'
```

#### File Filtering and Analysis
```bash
# Find files by extension
cat repomix-output.json | jq -r '.files | keys[] | select(endswith(".ts"))'
cat repomix-output.json | jq -r '.files | keys[] | select(endswith(".js") or endswith(".ts"))'

# Get files containing specific text
cat repomix-output.json | jq -r '.files | to_entries[] | select(.value | contains("function")) | .key'

# Create a file list with character counts
cat repomix-output.json | jq -r '.files | to_entries[] | "\(.key): \(.value | length) characters"'
```

#### Metadata Extraction
```bash
# Extract directory structure
cat repomix-output.json | jq -r '.directoryStructure'

# Get file summary information
cat repomix-output.json | jq '.fileSummary.purpose'
cat repomix-output.json | jq -r '.fileSummary.generationHeader'

# Extract user-provided header (if exists)
cat repomix-output.json | jq -r '.userProvidedHeader // "No header provided"'

# Get custom instructions
cat repomix-output.json | jq -r '.instruction // "No instructions provided"'
```

#### Advanced Analysis
```bash
# Find largest files by content length
cat repomix-output.json | jq -r '.files | to_entries[] | [.key, (.value | length)] | @tsv' | sort -k2 -nr | head -10

# Search for files containing specific patterns
cat repomix-output.json | jq -r '.files | to_entries[] | select(.value | test("import.*react"; "i")) | .key'

# Extract file paths matching multiple extensions
cat repomix-output.json | jq -r '.files | keys[] | select(test("\.(js|ts|jsx|tsx)$"))'
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
## Usage with AI Models

Each format works well with AI models, but consider:
- Use XML for Claude (best parsing accuracy)
- Use Markdown for general readability
- Use JSON for programmatic processing and API integration
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