# 配置

## 快速開始

創建配置文件：
```bash
repomix --init
```

## 配置選項

| 選項                             | 說明                                                                                                                         | 預設值                 |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `input.maxFileSize`              | 要處理的最大檔案大小（位元組）。超過此大小的檔案將被跳過                                                                    | `50000000`            |
| `output.filePath`                | 輸出檔案名                                                                                                                   | `"repomix-output.xml"` |
| `output.style`                   | 輸出樣式（`xml`、`markdown`、`plain`）                                                                                       | `"xml"`                |
| `output.parsableStyle`           | 是否根據所選樣式模式轉義輸出。注意這可能會增加令牌數量                                                                      | `false`                |
| `output.compress`                | 是否執行智慧程式碼提取以減少令牌數量                                                                                        | `false`                |
| `output.headerText`              | 要包含在檔案頭部的自定義文字                                                                                                | `null`                 |
| `output.instructionFilePath`     | 包含詳細自定義指令的檔案路徑                                                                                                | `null`                 |
| `output.fileSummary`             | 是否在輸出開頭包含摘要部分                                                                                                  | `true`                 |
| `output.directoryStructure`      | 是否在輸出中包含目錄結構                                                                                                    | `true`                 |
| `output.files`                   | 是否在輸出中包含檔案內容                                                                                                    | `true`                 |
| `output.removeComments`          | 是否從支援的檔案類型中刪除註釋                                                                                              | `false`                |
| `output.removeEmptyLines`        | 是否從輸出中刪除空行                                                                                                        | `false`                |
| `output.showLineNumbers`         | 是否為每行添加行號                                                                                                          | `false`                |
| `output.copyToClipboard`         | 是否除了儲存檔案外還將輸出複製到系統剪貼簿                                                                                  | `false`                |
| `output.topFilesLength`          | 在摘要中顯示的頂部檔案數量。如果設置為0，則不顯示摘要                                                                       | `5`                    |
| `output.includeEmptyDirectories` | 是否在儲存庫結構中包含空目錄                                                                                                | `false`                |
| `output.git.sortByChanges`       | 是否按Git更改次數對檔案進行排序（更改較多的檔案顯示在底部）                                                                | `true`                 |
| `output.git.sortByChangesMaxCommits` | 分析Git更改時要分析的最大提交數                                                                                         | `100`                  |
| `output.git.includeDiffs`        | 是否在輸出中包含Git差異（分別包含工作樹和暫存區的更改）                                                                     | `false`                |
| `include`                        | 要包含的檔案模式（使用[glob模式](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)）                   | `[]`                   |
| `ignore.useGitignore`            | 是否使用專案的`.gitignore`檔案中的模式                                                                                      | `true`                 |
| `ignore.useDefaultPatterns`      | 是否使用預設忽略模式                                                                                                        | `true`                 |
| `ignore.customPatterns`          | 額外的忽略模式（使用[glob模式](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)）                    | `[]`                   |
| `security.enableSecurityCheck`   | 是否對檔案執行安全檢查                                                                                                      | `true`                 |
| `tokenCount.encoding`            | OpenAI的[tiktoken](https://github.com/openai/tiktoken)分詞器使用的令牌計數編碼（例如：GPT-4o使用`o200k_base`，GPT-4/3.5使用`cl100k_base`）。詳見[tiktoken model.py](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py#L24)。 | `"o200k_base"`         |

配置檔案支援[JSON5](https://json5.org/)語法，允許：
- 註釋（單行和多行）
- 物件和陣列中的尾隨逗號
- 無引號屬性名
- 更靈活的字串語法

## 配置檔案示例

以下是完整配置檔案（`repomix.config.json`）的示例：

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
    "headerText": "打包檔案的自定義頭部資訊",
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
    // 模式也可以在 .repomixignore 中指定
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

## 全局配置

創建全局配置：
```bash
repomix --init --global
```

位置：
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## 忽略模式

優先順序：
1. CLI選項（`--ignore`）
2. `.repomixignore`
3. `.gitignore`和`.git/info/exclude`
4. 預設模式

`.repomixignore`示例：
```text
# 緩存目錄
.cache/
tmp/

# 構建輸出
dist/
build/

# 日誌
*.log
```

## 預設忽略模式

預設包含的常見模式：
```text
node_modules/**
.git/**
coverage/**
dist/**
```

完整列表：[defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)

## 示例

### 程式碼壓縮

當`output.compress`設置為`true`時，Repomix將提取基本程式碼結構，同時移除實現細節。這可以在保持重要的結構資訊的同時減少令牌數量。

更多詳細資訊和示例，請參閱[程式碼壓縮指南](code-compress)。

### Git集成

`output.git`配置允許您控制如何基於Git歷史記錄對檔案進行排序以及如何包含Git差異：

- `sortByChanges`：當設置為`true`時，檔案將按Git更改次數（修改該檔案的提交數）進行排序。更改次數較多的檔案將出現在輸出的底部。這有助於優先處理更活躍開發的檔案。預設值：`true`
- `sortByChangesMaxCommits`：計算檔案更改次數時要分析的最大提交數。預設值：`100`
- `includeDiffs`：當設置為`true`時，在輸出中包含Git差異（同時分別包含工作樹和暫存區的更改）。這允許讀者查看存儲庫中的待處理更改。預設值：`false`

配置示例：
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

### 註釋移除

當`output.removeComments`設置為`true`時，將從支援的檔案類型中移除註釋，以減少輸出大小並專注於核心程式碼內容。

有關支援的語言和詳細示例，請參閱[註釋移除指南](comment-removal)。
