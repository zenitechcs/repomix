# 基本的な使い方

## クイックスタート

リポジトリ全体をパッケージング
```bash
repomix
```

## 一般的な使用例

### 特定のディレクトリをパッケージング
```bash
repomix path/to/directory
```

### 特定のファイルを含める
[globパターン](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)を使用
```bash
repomix --include "src/**/*.ts,**/*.md"
```

### ファイルを除外
```bash
repomix --ignore "**/*.log,tmp/"
```

### リモートリポジトリを処理
```bash
# GitHubのURLを使用
repomix --remote https://github.com/user/repo

# 省略形を使用
repomix --remote user/repo

# 特定のブランチ/タグ/コミット
repomix --remote user/repo --remote-branch main
repomix --remote user/repo --remote-branch 935b695
```

## 出力フォーマット

### プレーンテキスト（デフォルト）
```bash
repomix --style plain
```

### XML
```bash
repomix --style xml
```

### Markdown
```bash
repomix --style markdown
```

## その他のオプション

### コメントを削除
```bash
repomix --remove-comments
```

### 行番号を表示
```bash
repomix --output-show-line-numbers
```

### クリップボードにコピー
```bash
repomix --copy
```

### セキュリティチェックを無効化
```bash
repomix --no-security-check
```

## 設定

設定ファイルを初期化
```bash
repomix --init
```

詳細な設定オプションについては[設定ガイド](/ja/guide/configuration)をご覧ください。
