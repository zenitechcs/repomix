# 配置

## 快速開始

創建配置文件：
```bash
repomix --init
```

## 配置文件

`repomix.config.json`：
```json
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "parsableStyle": true,
    "compress": false,
    "headerText": "自定義頭部文本",
    "instructionFilePath": "repomix-instruction.md",
    "fileSummary": true,
    "directoryStructure": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "includeEmptyDirectories": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100
    }
  },
  "include": ["**/*"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": ["tmp/", "*.log"]
  },
  "security": {
    "enableSecurityCheck": true
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
1. CLI 選項 (`--ignore`)
2. `.repomixignore`
3. `.gitignore` 和 `.git/info/exclude`
4. 預設模式

`.repomixignore` 示例：
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

當 `output.compress` 設置為 `true` 時，Repomix 將提取基本程式碼結構，同時移除實現細節。這可以在保持重要的結構信息的同時減少令牌數量。

更多詳細信息和示例，請參閱[程式碼壓縮指南](code-compress)。

### Git 集成
