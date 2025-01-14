# 出力

Repomix は、コードの分析結果や変更内容をさまざまな形式で出力できます。このドキュメントでは、Repomix の出力形式、出力先、および出力をカスタマイズする方法について説明します。

## 出力形式

Repomix は、以下の出力形式をサポートしています。

- **plain:** プレーンテキスト形式。
- **markdown:** Markdown 形式。
- **xml:** XML 形式。

出力形式は、コマンドラインオプションまたは設定ファイルで指定できます。

### コマンドラインオプション

コマンドラインから Repomix を実行する際に、`--output-style` オプションを使用して出力形式を指定します。

```bash
repomix src/ --output-style markdown
```

このコマンドは、`src/` ディレクトリ内のファイルを処理し、結果を Markdown 形式で出力します。

### 設定ファイル

設定ファイル (`repomix.config.json`) で `outputStyle` オプションを設定することもできます。

```json
{
  "outputStyle": "xml"
}
```

設定ファイルを有効にした場合、`--output-style` オプションを明示的に指定しなくても、Repomix は指定された形式で出力を行います。

## 出力先

Repomix の出力先は、標準出力またはファイルです。

### 標準出力

デフォルトでは、Repomix の出力は標準出力に表示されます。

```bash
repomix src/
```

このコマンドを実行すると、処理結果がターミナルに直接表示されます。

### ファイル出力

`--output-file` オプションを使用すると、出力をファイルに保存できます。

```bash
repomix src/ --output-file report.md
```

このコマンドは、処理結果を `report.md` ファイルに保存します。ファイルが存在しない場合は新規作成され、存在する場合は上書きされます。

設定ファイルで `outputFile` オプションを指定することも可能です。

```json
{
  "outputFile": "report.xml"
}
```

設定ファイルで出力先を指定した場合、コマンドラインで `--output-file` オプションを使用しない限り、指定されたファイルに結果が出力されます。

## 出力のカスタマイズ

Repomix の出力は、出力形式に応じて内容が異なります。

### plain 形式

プレーンテキスト形式では、分析結果や変更内容がそのままテキストで出力されます。

```
ファイル: src/index.ts
  - 提案: 不要なコメントを削除してください。
  - 変更: console.log を logger.info に変更しました。
```

### markdown 形式

Markdown 形式では、見出し、リスト、コードブロックなどが使用され、可読性の高い形式で出力されます。

```markdown
## ファイル: src/index.ts

- 提案: 不要なコメントを削除してください。
- 変更: `console.log` を `logger.info` に変更しました。

```

### xml 形式

XML 形式では、構造化されたデータとして出力されます。他のツールで処理する場合に適しています。

```xml
<file path="src/index.ts">
  <suggestion>不要なコメントを削除してください。</suggestion>
  <change><code>console.log</code> を <code>logger.info</code> に変更しました。</change>
</file>
```

## クリップボードへのコピー

`--copy-to-clipboard` オプションを使用すると、出力をクリップボードにコピーできます。

```bash
repomix src/ --copy-to-clipboard
```

このオプションは、結果をすぐに他の場所に貼り付けたい場合に便利です。

## 出力例

### Markdown 形式でファイルに出力

```bash
repomix src/ --output-style markdown --output-file report.md
```

`report.md` ファイルの内容:

```markdown
## ファイル: src/utils.ts

- 提案: 関数名をより分かりやすい名前に変更してください。

```

### XML 形式で標準出力に出力

```bash
repomix src/ --output-style xml
```

標準出力の内容:

```xml
<file path="src/config.ts">
  <suggestion>設定ファイルの読み込み処理を改善してください。</suggestion>
</file>
```

## まとめ

Repomix の出力形式と出力先を理解することで、目的に合わせた形式で結果を取得し、効率的に作業を進めることができます。コマンドラインオプションや設定ファイルを活用して、最適な出力設定を行いましょう。
