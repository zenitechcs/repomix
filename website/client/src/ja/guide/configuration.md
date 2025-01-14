# 設定

Repomix は、設定ファイル (`repomix.config.json`) を使用して、動作をカスタマイズできます。設定ファイルでは、API キー、出力形式、無視するファイルパターンなど、さまざまなオプションを設定できます。このドキュメントでは、設定ファイルの作成方法と、設定可能なオプションについて説明します。

## 設定ファイルの作成

設定ファイルは、プロジェクトのルートディレクトリに `repomix.config.json` という名前で作成します。ファイルが存在しない場合は、Repomix がデフォルトの設定を使用します。

```json
{
  // 設定オプションを記述
}
```

## 設定オプション

設定ファイルで設定可能なオプションについて説明します。

### `apiKeys`

外部サービスとの連携に必要な API キーを設定します。例えば、OpenAI の API キーを設定できます。

```json
{
  "apiKeys": {
    "openai": "YOUR_OPENAI_API_KEY"
  }
}
```

### `outputStyle`

出力形式を設定します。`plain`, `markdown`, `xml` から選択できます。

```json
{
  "outputStyle": "markdown"
}
```

### `outputFile`

出力先のファイルを指定します。

```json
{
  "outputFile": "report.md"
}
```

### `ignore`

処理対象から除外するファイルまたはディレクトリのパターンを配列で指定します。`.gitignore` 形式のパターンを使用できます。

```json
{
  "ignore": [
    "tests/",
    "*.test.ts"
  ]
}
```

### `commentRemoval`

コメント削除機能を有効にするかどうかを設定します。`true` に設定すると、コードからコメントが削除されます。

```json
{
  "commentRemoval": true
}
```

詳細な設定については、以下のようにオブジェクト形式で指定できます。

```json
{
  "commentRemoval": {
    "removeSingleLineComments": true,
    "removeMultiLineComments": true,
    "removeJSDocComments": false
  }
}
```

### `customInstructions`

カスタム指示ファイルへのパスを指定します。

```json
{
  "customInstructions": "custom_instructions.txt"
}
```

### `promptExamples`

プロンプトの例を定義します。

```json
{
  "promptExamples": [
    {
      "description": "コードのレビュー",
      "prompt": "このコードをレビューしてください。"
    },
    {
      "description": "リファクタリング",
      "prompt": "この関数をリファクタリングしてください。"
    }
  ]
}
```

## 設定ファイルの適用

設定ファイルは、Repomix の実行時に自動的に読み込まれます。コマンドラインオプションと設定ファイルで同じオプションが指定された場合、コマンドラインオプションの設定が優先されます。

## 環境変数による設定

一部のオプションは、環境変数を通じて設定することも可能です。環境変数の名前は、設定オプションを大文字に変換し、プレフィックス `REPOMIX_` を付加したものになります。

例えば、OpenAI の API キーは、環境変数 `REPOMIX_API_KEYS_OPENAI` で設定できます。

```bash
export REPOMIX_API_KEYS_OPENAI="YOUR_OPENAI_API_KEY"
```

## 設定の優先順位

Repomix の設定は、以下の優先順位で適用されます。

1. コマンドラインオプション
2. 環境変数
3. 設定ファイル (`repomix.config.json`)
4. デフォルト設定

## 設定例

以下は、一般的な設定ファイルの例です。

```json
{
  "apiKeys": {
    "openai": "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  },
  "outputStyle": "markdown",
  "ignore": [
    "node_modules/",
    "dist/"
  ],
  "commentRemoval": {
    "removeSingleLineComments": true,
    "removeMultiLineComments": false,
    "removeJSDocComments": false
  }
}
```

## まとめ

設定ファイルを活用することで、Repomix の動作をプロジェクトのニーズに合わせて柔軟にカスタマイズできます。コマンドラインオプション、環境変数と組み合わせて、最適な設定を見つけてください。
