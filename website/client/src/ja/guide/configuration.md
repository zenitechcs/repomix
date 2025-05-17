# 設定

## クイックスタート

設定ファイルを作成：
```bash
repomix --init
```

## 設定オプション

| オプション                        | 説明                                                                                                                         | デフォルト値           |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `input.maxFileSize`              | 処理する最大ファイルサイズ（バイト）。これより大きいファイルはスキップされます                                              | `50000000`            |
| `output.filePath`                | 出力ファイル名                                                                                                               | `"repomix-output.xml"` |
| `output.style`                   | 出力形式（`xml`、`markdown`、`plain`）                                                                                       | `"xml"`                |
| `output.parsableStyle`           | 選択したスタイルスキーマに基づいて出力をエスケープするかどうか。トークン数が増加する可能性があります                       | `false`                |
| `output.compress`                | トークン数を削減するためにインテリジェントなコード抽出を実行するかどうか                                                    | `false`                |
| `output.headerText`              | ファイルヘッダーに含めるカスタムテキスト                                                                                    | `null`                 |
| `output.instructionFilePath`     | 詳細なカスタム指示を含むファイルへのパス                                                                                    | `null`                 |
| `output.fileSummary`             | 出力の先頭にサマリーセクションを含めるかどうか                                                                              | `true`                 |
| `output.directoryStructure`      | 出力にディレクトリ構造を含めるかどうか                                                                                      | `true`                 |
| `output.files`                   | 出力にファイル内容を含めるかどうか                                                                                          | `true`                 |
| `output.removeComments`          | サポートされているファイルタイプからコメントを削除するかどうか                                                              | `false`                |
| `output.removeEmptyLines`        | 出力から空行を削除するかどうか                                                                                              | `false`                |
| `output.showLineNumbers`         | 各行に行番号を追加するかどうか                                                                                              | `false`                |
| `output.copyToClipboard`         | ファイルの保存に加えて、出力をシステムクリップボードにコピーするかどうか                                                    | `false`                |
| `output.topFilesLength`          | サマリーに表示するトップファイルの数。0に設定すると、サマリーは表示されません                                               | `5`                    |
| `output.includeEmptyDirectories` | リポジトリ構造に空のディレクトリを含めるかどうか                                                                            | `false`                |
| `output.git.sortByChanges`       | Gitの変更回数でファイルをソートするかどうか（変更が多いファイルが下部に表示されます）                                      | `true`                 |
| `output.git.sortByChangesMaxCommits` | Gitの変更を分析する最大コミット数                                                                                       | `100`                  |
| `output.git.includeDiffs`        | 出力にGitの差分を含めるかどうか（ワークツリーとステージング済みの変更を別々に含みます）                                    | `false`                |
| `include`                        | 含めるファイルのパターン（[globパターン](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)を使用）     | `[]`                   |
| `ignore.useGitignore`            | プロジェクトの`.gitignore`ファイルのパターンを使用するかどうか                                                              | `true`                 |
| `ignore.useDefaultPatterns`      | デフォルトの除外パターンを使用するかどうか                                                                                  | `true`                 |
| `ignore.customPatterns`          | 追加の除外パターン（[globパターン](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)を使用）          | `[]`                   |
| `security.enableSecurityCheck`   | ファイルのセキュリティチェックを実行するかどうか                                                                            | `true`                 |
| `tokenCount.encoding`            | OpenAIの[tiktoken](https://github.com/openai/tiktoken)トークナイザーで使用するトークンカウントエンコーディング（例：GPT-4oの場合は`o200k_base`、GPT-4/3.5の場合は`cl100k_base`）。詳細は[tiktoken model.py](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py#L24)を参照してください。 | `"o200k_base"`         |

設定ファイルは[JSON5](https://json5.org/)構文をサポートしており、以下が可能です：
- コメント（単一行および複数行）
- オブジェクトと配列の末尾のカンマ
- 引用符なしのプロパティ名
- より柔軟な文字列構文

## 設定ファイルの例

以下は完全な設定ファイル（`repomix.config.json`）の例です：

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
    "headerText": "パッケージ化されたファイルのカスタムヘッダー情報",
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
    // パターンは .repomixignore でも指定できます
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

## グローバル設定

グローバル設定を作成：
```bash
repomix --init --global
```

設定ファイルの場所：
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## 除外パターン

優先順位：
1. CLIオプション（`--ignore`）
2. `.repomixignore`
3. `.gitignore` および `.git/info/exclude`
4. デフォルトパターン

`.repomixignore` の例：
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

デフォルトで含まれる一般的なパターン：
```text
node_modules/**
.git/**
coverage/**
dist/**
```

全リスト: [defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)

## 設定例

### コード圧縮

`output.compress`を`true`に設定すると、Repomixは実装の詳細を削除しながら、本質的なコード構造を抽出します。これにより、トークン数を削減しながら重要な構造情報を維持できます。

詳細と例については[コード圧縮ガイド](code-compress)をご覧ください。

### Git統合

`output.git`設定では、Gitの履歴に基づいてファイルをソートする方法や、Gitの差分を含める方法を制御できます：

- `sortByChanges`: `true`に設定すると、ファイルはGitの変更回数（そのファイルを変更したコミット数）でソートされます。より多くの変更があるファイルが出力の下部に表示されます。これは、より活発に開発されているファイルを優先するのに役立ちます。デフォルト: `true`
- `sortByChangesMaxCommits`: ファイルの変更回数を数える際に分析する最大コミット数。デフォルト: `100`
- `includeDiffs`: `true`に設定すると、Git差分を出力に含めます（ワークツリーとステージング済みの変更を別々に含みます）。これにより、リポジトリの保留中の変更を確認できます。デフォルト: `false`

設定例：
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

### コメントの削除

`output.removeComments`を`true`に設定すると、サポートされているファイルタイプからコメントが削除され、出力サイズを削減し、本質的なコード内容に焦点を当てることができます。

サポートされている言語と詳細な例については[コメント削除ガイド](comment-removal)をご覧ください。
