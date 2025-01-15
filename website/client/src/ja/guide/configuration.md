# 設定

## クイックスタート

設定ファイルの作成。

```bash
repomix --init
```

## 設定ファイル (`repomix.config.json`)

```json
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "headerText": "カスタムヘッダーテキスト",
    "instructionFilePath": "repomix-instruction.md",
    "fileSummary": true,
    "directoryStructure": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "includeEmptyDirectories": false
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

## グローバル設定ファイル

グローバル設定ファイルの作成。

```bash
repomix --init --global
```

設定ファイルの場所。

- Windows: `%LOCALAPPDATA%\\Repomix\\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## 除外パターン (`.repomixignore`)

優先順位

1. CLIオプション（`--ignore`）
2. .repomixignore
3. .gitignore
4. デフォルトパターン

`.repomixignore`の例

```text
# キャッシュディレクトリ
.cache/
tmp/

# ビルド出力
dist/
build/

# ログ
*.log
```

## デフォルトの除外パターン

デフォルトで含まれる一般的なパターン

```text
node_modules/**
.git/**
coverage/**
dist/**
```

完全なリスト：[defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)
