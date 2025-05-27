# GitHub Actions

Repomix は GitHub Actions と統合して、リポジトリを自動的に処理し、AI フレンドリーな出力を生成することができます。これにより、CI/CD パイプラインの一部として Repomix を使用することができます。

## 基本的な使用方法

以下は、GitHub Actions で Repomix を使用するための基本的なワークフロー設定です：

```yaml
name: Repomix

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  repomix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Run Repomix
        run: npx repomix --output-file repomix-output.xml
      
      - name: Upload Repomix Output
        uses: actions/upload-artifact@v3
        with:
          name: repomix-output
          path: repomix-output.xml
```

このワークフローは、メインブランチへのプッシュまたはプルリクエストがあるたびに実行され、リポジトリを処理して `repomix-output.xml` ファイルを生成し、それをアーティファクトとしてアップロードします。

## 高度な設定

より高度な設定では、以下のようなオプションを追加できます：

```yaml
name: Repomix Advanced

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 1'  # 毎週月曜日に実行

jobs:
  repomix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Run Repomix
        run: |
          npx repomix \
            --style markdown \
            --output-file repomix-output.md \
            --include "src/**/*.ts,docs/**/*.md" \
            --ignore "**/*.test.ts,**/node_modules/**" \
            --remove-comments \
            --compress
      
      - name: Upload Repomix Output
        uses: actions/upload-artifact@v3
        with:
          name: repomix-output
          path: repomix-output.md
      
      - name: Create GitHub Release
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: softprops/action-gh-release@v1
        with:
          files: repomix-output.md
          name: Repomix Output ${{ github.sha }}
          tag_name: repomix-${{ github.sha }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

この高度な設定では、以下のことを行っています：

1. スケジュールされた実行を追加（毎週月曜日）
2. より多くの Repomix オプションを使用
3. メインブランチへのプッシュ時に GitHub リリースを作成

## 環境変数とシークレット

センシティブな情報を扱う場合は、GitHub シークレットを使用できます：

```yaml
- name: Run Repomix with Auth
  run: npx repomix --remote user/private-repo
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## マトリックスビルド

複数の設定で Repomix を実行するには、マトリックスビルドを使用できます：

```yaml
jobs:
  repomix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        output-style: [xml, markdown, plain]
        node-version: [16, 18, 20]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Run Repomix
        run: npx repomix --style ${{ matrix.output-style }} --output-file repomix-output.${{ matrix.output-style }}
      
      - name: Upload Repomix Output
        uses: actions/upload-artifact@v3
        with:
          name: repomix-output-${{ matrix.output-style }}-node${{ matrix.node-version }}
          path: repomix-output.${{ matrix.output-style }}
```

## プルリクエストコメント

Repomix の出力をプルリクエストにコメントとして追加することもできます：

```yaml
- name: Run Repomix
  run: npx repomix --style markdown --output-file repomix-output.md

- name: Comment on PR
  if: github.event_name == 'pull_request'
  uses: actions/github-script@v6
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    script: |
      const fs = require('fs');
      const output = fs.readFileSync('repomix-output.md', 'utf8');
      const summary = output.split('\n').slice(0, 20).join('\n') + '\n\n[Full output attached as artifact]';
      
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: summary
      });
```

## 次のステップ

- [コマンドラインオプション](command-line-options.md)の詳細を確認する
- [設定オプション](configuration.md)について学ぶ
- [リモートリポジトリ処理](remote-repository-processing.md)について探る
