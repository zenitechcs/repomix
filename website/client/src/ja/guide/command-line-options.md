# コマンドラインオプション

## 基本オプション

```bash
repomix [directory]  # 特定のディレクトリを処理（指定しない場合はカレントディレクトリ）
```

## 出力オプション

| オプション | 説明 | デフォルト |
|--------|-------------|---------|
| `-o, --output <file>` | 出力ファイル名 | `repomix-output.txt` |
| `--style <type>` | 出力形式（`plain`, `xml`, `markdown`） | `plain` |
| `--output-show-line-numbers` | 行番号を追加 | `false` |
| `--copy` | クリップボードにコピー | `false` |
| `--no-file-summary` | ファイルサマリーを無効化 | `true` |
| `--no-directory-structure` | ディレクトリ構造を無効化 | `true` |
| `--remove-comments` | コメントを削除 | `false` |
| `--remove-empty-lines` | 空行を削除 | `false` |

## フィルターオプション

| オプション | 説明 |
|--------|-------------|
| `--include <patterns>` | 指定したファイルまたはディレクトリをパッケージング対象に含める |
| `-i, --ignore <patterns>` | 指定したファイルまたはディレクトリをパッケージング対象から除外する |

## リモートリポジトリ

| オプション | 説明 |
|--------|-------------|
| `--remote <url>` | 指定したリモートリポジトリをパッケージングする |
| `--remote-branch <name>` | リモートリポジトリの特定のブランチ、タグ、またはコミットハッシュを指定する |

## 設定

| オプション | 説明 |
|--------|-------------|
| `-c, --config <path>` | カスタム設定ファイルのパス |
| `--init` | 設定ファイルを作成 |
| `--global` | グローバル設定を使用 |

## セキュリティ

| オプション | 説明 | デフォルト |
|--------|-------------|---------|
| `--no-security-check` | セキュリティチェックを無効化 | `true` |

## その他のオプション

| オプション | 説明 |
|--------|-------------|
| `-v, --version` | バージョンを表示 |
| `--verbose` | 詳細なログ出力を有効化 |
| `--top-files-len <number>` | 上位何件のファイルを詳細出力するかを指定する | `5` |

## 使用例

```bash
# 基本的な使用方法
repomix

# 出力ファイル名とフォーマットを指定
repomix -o output.xml --style xml

# 特定のファイルを含める、または除外する
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# リモートリポジトリをパッケージングする
repomix --remote user/repo --remote-branch main
```
