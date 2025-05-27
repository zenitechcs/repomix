# MCP サーバー

MCP (Merged Code Processor) サーバーは、Repomix の機能をウェブサービスとして提供するサーバーコンポーネントです。これにより、Repomix の機能をウェブアプリケーションやその他のサービスに統合することができます。

## MCP サーバーとは

MCP サーバーは、HTTP API を通じて Repomix の機能を提供する軽量なサーバーです。これにより、以下のことが可能になります：

1. **リモート処理**: リモートサーバーでコードベースを処理する
2. **ウェブインテグレーション**: Repomix 機能をウェブアプリケーションに統合する
3. **自動化**: CI/CD パイプラインや他の自動化ワークフローに Repomix を組み込む

## MCP サーバーの起動

MCP サーバーを起動するには、以下のコマンドを使用します：

```bash
repomix serve
```

デフォルトでは、サーバーはポート 3000 でリッスンします。ポートを変更するには：

```bash
repomix serve --port 8080
```

## API エンドポイント

MCP サーバーは以下の主要なエンドポイントを提供します：

### POST /process

リポジトリを処理し、マージされた出力を返します。

**リクエスト本文**:

```json
{
  "repositoryUrl": "https://github.com/user/repo",
  "branch": "main",
  "outputStyle": "xml",
  "includePatterns": ["src/**/*.ts"],
  "ignorePatterns": ["**/*.test.ts"],
  "removeComments": false,
  "compress": false
}
```

**レスポンス**:

```json
{
  "output": "...",
  "tokenCount": 12345,
  "fileCount": 42
}
```

### GET /health

サーバーの健全性を確認します。

**レスポンス**:

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

## セキュリティ

MCP サーバーを公開する場合は、以下のセキュリティ対策を検討してください：

1. **認証**: API キーまたは他の認証メカニズムを実装する
2. **レート制限**: 過剰な使用を防ぐためにレート制限を設定する
3. **HTTPS**: 常に HTTPS を使用して通信を暗号化する
4. **アクセス制御**: 必要に応じてアクセス制御を実装する

## 設定オプション

MCP サーバーは以下の設定オプションをサポートしています：

- `--port <number>`: サーバーがリッスンするポート（デフォルト: 3000）
- `--host <string>`: サーバーがバインドするホスト（デフォルト: localhost）
- `--cors`: CORS を有効にする（デフォルト: false）
- `--cors-origin <string>`: 許可する CORS オリジン（デフォルト: *）
- `--rate-limit <number>`: IP ごとの 1 分あたりのリクエスト数（デフォルト: 60）

## クライアント統合

MCP サーバーは RESTful API を提供するため、任意の HTTP クライアントを使用して統合できます。

**cURL の例**:

```bash
curl -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryUrl": "https://github.com/user/repo",
    "outputStyle": "xml"
  }'
```

**JavaScript の例**:

```javascript
fetch('http://localhost:3000/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    repositoryUrl: 'https://github.com/user/repo',
    outputStyle: 'xml'
  }),
})
.then(response => response.json())
.then(data => console.log(data));
```

## 次のステップ

- [コマンドラインオプション](command-line-options.md)の詳細を確認する
- [設定オプション](configuration.md)について学ぶ
- [GitHub Actions](github-actions.md)との統合について探る
