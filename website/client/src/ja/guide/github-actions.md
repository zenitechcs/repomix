# GitHub ActionsでRepomixを使う

GitHub ActionsワークフローにRepomixを組み込むことで、AI解析用のコードベースパッキングを自動化できます。CIやコードレビュー、LLMツール向けの準備に便利です。

## 基本的な使い方

リポジトリをパックするには、ワークフローYAMLに以下のステップを追加します。

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    include: "**/*.ts"
    output: repomix-output.txt
```

## 複数ディレクトリ・圧縮オプション

複数ディレクトリやinclude/excludeパターン、スマート圧縮も指定できます。

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src tests
    include: "**/*.ts,**/*.md"
    ignore: "**/*.test.ts"
    output: repomix-output.txt
    compress: true
```

## 出力ファイルをアーティファクトとしてアップロード

生成したファイルを後続ステップやダウンロード用にアップロードする例です。

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    output: repomix-output.txt
    compress: true

- name: Upload Repomix output
  uses: actions/upload-artifact@v4
  with:
    name: repomix-output
    path: repomix-output.txt
```

## Actionの入力パラメータ

| 名前                | 説明                                   | デフォルト         |
|---------------------|----------------------------------------|--------------------|
| `directories`       | パック対象ディレクトリ（空白区切り）    | `.`                |
| `include`           | 含めるファイルのglobパターン（カンマ区切り） | `""`           |
| `ignore`            | 除外するファイルのglobパターン（カンマ区切り） | `""`           |
| `output`            | 出力ファイルパス                        | `repomix.txt`      |
| `compress`          | スマート圧縮の有効化                    | `true`             |
| `additional-args`   | repomix CLIへの追加引数                 | `""`           |
| `repomix-version`   | インストールするnpmパッケージのバージョン | `latest`           |

## Actionの出力

| 名前           | 説明                       |
|----------------|----------------------------|
| `output_file`  | 生成された出力ファイルのパス |

## ワークフロー全体例

Repomixを使ったGitHub Actionsワークフローの例です。

```yaml
name: Pack and Upload Codebase
on:
  push:
    branches: [main]

jobs:
  pack:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Pack repository with Repomix
        uses: yamadashy/repomix/.github/actions/repomix@main
        with:
          directories: src
          include: "**/*.ts"
          output: repomix-output.txt
          compress: true
      - name: Upload Repomix output
        uses: actions/upload-artifact@v4
        with:
          name: repomix-output
          path: repomix-output.txt
``` 
