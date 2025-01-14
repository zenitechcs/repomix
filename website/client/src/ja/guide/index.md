# Repomixをはじめよう

Repomixは、リポジトリ全体をAIフレンドリーな単一ファイルにパッケージングするツールです。Claude、ChatGPT、Geminiなどの大規模言語モデル（LLM）にコードベースを提供するために設計されています。

## クイックスタート

プロジェクトディレクトリで以下のコマンドを実行するだけです：

```bash
npx repomix
```

これだけです！`repomix-output.txt`ファイルにAIフレンドリーな形式でリポジトリ全体がまとめられます。

このファイルを以下のようなプロンプトとともにAIアシスタントに送信できます：

```
このファイルはリポジトリ内のすべてのファイルを1つにまとめたものです。
コードのリファクタリングを行いたいので、まずはコードレビューをお願いします。
```

AIはコードベース全体を分析し、包括的な洞察を提供します：

![Repomixの使用例1](/images/docs/repomix-file-usage-1.png)

具体的な変更点を議論する際、AIはコードの生成をサポートします。Claudeのアーティファクト機能などを使用すると、相互に依存する複数のファイルを受け取ることも可能です：

![Repomixの使用例2](/images/docs/repomix-file-usage-2.png)

Happy coding! 🚀

## 主な機能

- **AI最適化**: コードベースをAIが理解・処理しやすい形式にフォーマット化
- **トークンカウント**: LLMのコンテキスト制限に対応するためのトークン数計測
- **Git対応**: .gitignoreファイルを自動的に認識
- **セキュリティ重視**: 機密情報の検出と保護
- **複数の出力形式**: プレーンテキスト、XML、Markdownから選択可能

## 次のステップ

- [インストールガイド](installation.md): Repomixのインストール方法
- [使用方法](usage.md): 基本機能と高度な機能の説明
- [設定](configuration.md): Repomixのカスタマイズ方法
- [セキュリティ機能](security.md): セキュリティチェックについて

## コミュニティ

[Discordコミュニティ](https://discord.gg/wNYzTwZFku)に参加して：
- Repomixの使い方について質問
- 経験やノウハウの共有
- 新機能の提案
- 他のユーザーとの交流

## サポート

バグを見つけた場合や支援が必要な場合：
- [GitHubでイシューを作成](https://github.com/yamadashy/repomix/issues)
- Discordサーバーに参加
- [ドキュメント](https://repomix.com)を確認
