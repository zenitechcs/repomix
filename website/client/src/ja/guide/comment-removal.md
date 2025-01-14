# コメント削除

Repomix は、コードの可読性を向上させるために、不要なコメントを自動的に削除する機能を提供しています。このドキュメントでは、コメント削除機能の使い方と、削除対象となるコメントの種類について説明します。

## コメント削除機能の有効化

コメント削除機能は、コマンドラインオプションまたは設定ファイルを通じて有効にできます。

### コマンドラインオプション

コマンドラインから Repomix を実行する際に、`--comment-removal` オプションを指定することで、コメント削除機能を有効にできます。

```bash
repomix src/ --comment-removal
```

このコマンドを実行すると、`src/` ディレクトリ内のすべてのファイルからコメントが削除されます。

### 設定ファイル

設定ファイル (`repomix.config.json`) で `commentRemoval` オプションを `true` に設定することでも、コメント削除機能を有効にできます。

```json
{
  "commentRemoval": true
}
```

設定ファイルを有効にした場合、`--comment-removal` オプションを明示的に指定しなくても、Repomix は自動的にコメント削除を行います。

## 削除対象となるコメントの種類

Repomix は、以下の種類のコメントを削除対象とします。

- **単一行コメント:** `//` で始まるコメント。
  ```typescript
  // これは単一行コメントです
  const x = 10;
  ```
- **複数行コメント:** `/*` で始まり `*/` で終わるコメント。
  ```typescript
  /*
   * これは複数行コメントです
   * 複数行にわたる説明を記述できます
   */
  const y = 20;
  ```
- **JSDoc コメント:** `/**` で始まり `*/` で終わるドキュメンテーションコメント。
  ```typescript
  /**
   * この関数は二つの数値を加算します。
   * @param a 最初の数値
   * @param b 二番目の数値
   * @returns 合計
   */
  function add(a: number, b: number): number {
    return a + b;
  }
  ```

**注意:** JSDoc コメントは、設定によっては削除されない場合があります。設定ファイルで JSDoc コメントの削除を制御できます。

## コメント削除の注意点

- **コードの意図の喪失:** コメントは、コードの意図や背景を伝える重要な役割を果たしている場合があります。コメントを削除する際は、コードの可読性が損なわれないように注意してください。
- **ドキュメントの喪失:** JSDoc コメントは、API ドキュメント生成に利用される場合があります。不用意に削除すると、ドキュメントが不足する可能性があります。
- **バージョン管理:** コメント削除を行う前に、必ずバージョン管理システムにコミットしてください。これにより、必要に応じてコメントを復元できます。

## コメント削除のカスタマイズ

設定ファイルを使用すると、コメント削除の動作を細かくカスタマイズできます。

```json
{
  "commentRemoval": {
    "removeSingleLineComments": true,
    "removeMultiLineComments": true,
    "removeJSDocComments": false
  }
}
```

- `removeSingleLineComments`: 単一行コメントを削除するかどうかを指定します。
- `removeMultiLineComments`: 複数行コメントを削除するかどうかを指定します。
- `removeJSDocComments`: JSDoc コメントを削除するかどうかを指定します。

## 使用例

### 単一行コメントと複数行コメントを削除する

```bash
repomix src/ --comment-removal
```

または、設定ファイルで以下のように設定します。

```json
{
  "commentRemoval": {
    "removeSingleLineComments": true,
    "removeMultiLineComments": true,
    "removeJSDocComments": false
  }
}
```

### すべてのコメントを削除する

```bash
repomix src/ --comment-removal --custom-instructions 'remove all comments'
```

または、設定ファイルで以下のように設定します。

```json
{
  "commentRemoval": {
    "removeSingleLineComments": true,
    "removeMultiLineComments": true,
    "removeJSDocComments": true
  }
}
```

## まとめ

Repomix のコメント削除機能は、コードのクリーンアップに役立ちますが、削除するコメントの種類や影響範囲を十分に理解した上で使用することが重要です。設定ファイルを活用して、プロジェクトのニーズに合わせたコメント削除を行いましょう。
