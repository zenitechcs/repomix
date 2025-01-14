# コマンドラインオプション

Repomix は、コマンドラインから実行する際に、さまざまなオプションを指定することで、動作をカスタマイズできます。このドキュメントでは、Repomix の主要なコマンドラインオプションとその使用方法について説明します。

## 基本的なオプション

### `--version`

Repomix のバージョンを表示します。

```bash
repomix --version
```

### `--help`

Repomix のヘルプメッセージを表示します。すべてのオプションと使用方法を確認できます。

```bash
repomix --help
```

## 処理対象の指定

### `<file>`

処理対象のファイルを指定します。複数のファイルを指定することも可能です。

```bash
repomix src/index.ts
repomix src/index.ts src/utils.ts
```

### `<directory>`

処理対象のディレクトリを指定します。指定したディレクトリ内のすべてのファイルが処理対象となります。

```bash
repomix src/
```

## 動作の制御

### `--prompt <prompt>`

実行するタスクを自然言語で指定します。

```bash
repomix src/index.ts --prompt "このコードをレビューしてください。"
```

### `--output-style <style>`

出力形式を指定します。`plain`, `markdown`, `xml` から選択できます。

```bash
repomix src/ --output-style markdown
```

### `--output-file <path>`

出力先のファイルを指定します。

```bash
repomix src/ --output-file report.md
```

### `--config <path>`

設定ファイルのパスを指定します。

```bash
repomix --config custom_config.json src/
```

### `--ignore <pattern>`

無視するファイルまたはディレクトリのパターンを指定します。

```bash
repomix src/ --ignore tests/
```

### `--no-ignore`

`.repomixignore` ファイルを無視して処理を実行します。

```bash
repomix src/ --no-ignore
```

### `--comment-removal`

コードからコメントを削除します。

```bash
repomix src/ --comment-removal
```

### `--custom-instructions <path>`

カスタム指示ファイルへのパスを指定します。

```bash
repomix src/ --custom-instructions custom_instructions.txt
```

### `--copy-to-clipboard`

出力をクリップボードにコピーします。

```bash
repomix src/ --copy-to-clipboard
```

## リモートリポジトリ関連

### `<remote_repository_url>`

処理対象のリモートリポジトリの URL を指定します。

```bash
repomix https://github.com/username/repository
```

## その他のオプション

### `--verbose`

詳細なログ出力を有効にします。

```bash
repomix src/ --verbose
```

### `--debug`

デバッグモードで実行します。

```bash
repomix src/ --debug
```

## オプションの組み合わせ

複数のオプションを組み合わせて使用することで、より複雑なタスクを実行できます。

```bash
repomix --output-style markdown --output-file report.md src/ "コードをレビューし、結果を Markdown 形式で report.md に出力してください。"
```

## まとめ

Repomix のコマンドラインオプションを理解することで、さまざまなタスクを効率的に実行できます。オプションを適切に組み合わせることで、Repomix の機能を最大限に活用してください。
