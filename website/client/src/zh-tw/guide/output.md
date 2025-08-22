# 輸出格式

Repomix 支援三種輸出格式：
- XML（預設）
- Markdown
- 純文字

## XML 格式

```bash
repomix --style xml
```

XML 格式針對 AI 處理進行了優化：

```xml
本文件是整個程式碼庫的合併表示形式...

<file_summary>
（元數據和 AI 指令）
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// 文件內容
</file>
</files>

<git_logs>
<git_log_commit>
<date>2025-08-20 00:47:19 +0900</date>
<message>feat(cli): Add --include-logs option for git commit history</message>
<files>
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts
</files>
</git_log_commit>
<git_log_commit>
<date>2025-08-21 00:09:43 +0900</date>
<message>Merge pull request #795 from yamadashy/chore/ratchet-update-ci</message>
<files>
.github/workflows/ratchet-update.yml
</files>
</git_log_commit>
</git_logs>
```

::: tip 為什麼選擇 XML？
XML 標籤有助於像 Claude 這樣的 AI 模型更準確地解析內容。[Claude 官方文檔](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags)推薦使用 XML 標籤來構建結構化提示。
:::

## Markdown 格式

```bash
repomix --style markdown
```

Markdown 提供了易讀的格式：

```markdown
本文件是整個程式碼庫的合併表示形式...

# 文件概要
（元數據和 AI 指令）

# 目錄結構
```
src/
index.ts
utils/
helper.ts
```

# 文件

## File: src/index.ts
```typescript
// 文件內容
```

# Git 記錄
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

## 在 AI 模型中的使用

每種格式都能在 AI 模型中正常工作，但需要考慮以下幾點：
- 對 Claude 使用 XML（解析最準確）
- 對一般可讀性使用 Markdown
- 對簡單性和通用兼容性使用純文字

## 自定義設置

在 `repomix.config.json` 中設置預設格式：
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## 純文字格式

```bash
repomix --style plain
```

輸出結構：
```text
本文件是整個程式碼庫的合併表示形式...

================
文件概要
================
（元數據和 AI 指令）

================
目錄結構
================
src/
  index.ts
  utils/
    helper.ts

================
文件
================

================
File: src/index.ts
================
// 文件內容

================
Git 記錄
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
