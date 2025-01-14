# リモートリポジトリの処理

Repomix は、ローカルファイルだけでなく、GitHub などのリモートリポジトリにあるファイルも処理できます。この機能を利用することで、チームで共有しているコードベース全体に対して、Repomix の分析や変更を適用できます。このドキュメントでは、リモートリポジトリの指定方法、認証、および処理の注意点について説明します。

## リモートリポジトリの指定

Repomix でリモートリポジトリを処理するには、コマンドラインオプションでリポジトリの URL を指定します。現在、GitHub リポジトリのみがサポートされています。

```bash
repomix https://github.com/ユーザー名/リポジトリ名
```

または、ブランチを指定することもできます。

```bash
repomix https://github.com/ユーザー名/リポジトリ名/tree/ブランチ名
```

特定のディレクトリのみを処理する場合は、リポジトリ URL の後にパスを追加します。

```bash
repomix https://github.com/ユーザー名/リポジトリ名/tree/ブランチ名/src
```

## 認証

プライベートリポジトリにアクセスする場合、Repomix は認証を必要とします。認証には、以下のいずれかの方法を使用できます。

### GitHub Personal Access Token

GitHub の Personal Access Token を使用して認証する方法です。トークンを作成し、`--github-token` オプションで Repomix に渡します。

```bash
repomix https://github.com/ユーザー名/プライベートリポジトリ --github-token YOUR_PERSONAL_ACCESS_TOKEN
```

Personal Access Token は、GitHub の設定画面で作成できます。`repo` スコープを付与してください。

### 環境変数

`GITHUB_TOKEN` 環境変数に Personal Access Token を設定することもできます。

```bash
export GITHUB_TOKEN=YOUR_PERSONAL_ACCESS_TOKEN
repomix https://github.com/ユーザー名/プライベートリポジトリ
```

環境変数を設定しておくと、コマンドラインオプションで毎回トークンを指定する必要がなくなります。

## 処理の注意点

- **ネットワーク:** リモートリポジトリの処理には、安定したインターネット接続が必要です。
- **リポジトリのサイズ:** 大きなリポジトリを処理する場合、処理に時間がかかることがあります。
- **変更のコミット:** Repomix はリモートリポジトリに直接変更をコミットしません。変更はローカルに適用されるため、必要に応じて自分でコミットしてください。
- **読み取り専用:** Repomix はリモートリポジトリからファイルをダウンロードして処理しますが、リモートリポジトリの内容を直接変更することはありません。

## リモートリポジトリ処理の例

### パブリックリポジトリの処理

```bash
repomix https://github.com/facebook/react
```

このコマンドは、React リポジトリ全体を処理します。

### 特定のブランチを処理

```bash
repomix https://github.com/vuejs/vue/tree/dev
```

このコマンドは、Vue.js リポジトリの `dev` ブランチを処理します。

### 特定のディレクトリを処理

```bash
repomix https://github.com/angular/angular/tree/main/packages/core
```

このコマンドは、Angular リポジトリの `packages/core` ディレクトリのみを処理します。

### プライベートリポジトリを処理 (トークンを使用)

```bash
repomix https://github.com/自分のユーザー名/自分のプライベートリポジトリ --github-token ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 環境変数を使用したプライベートリポジトリの処理

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
repomix https://github.com/自分のユーザー名/自分のプライベートリポジトリ
```

## まとめ

Repomix のリモートリポジトリ処理機能を活用することで、大規模なコードベースに対する分析や変更を効率的に行うことができます。認証方法を理解し、ネットワーク環境に注意して利用してください。
