import { defineConfig } from 'vitepress';

export const configJa = defineConfig({
  lang: 'ja',
  description: 'コードベースをAIフレンドリーな形式にパッケージング',
  themeConfig: {
    nav: [
      { text: '使い方', link: '/ja/guide/' },
      { text: 'Discordに参加', link: 'https://discord.gg/wNYzTwZFku' },
    ],
    sidebar: {
      '/ja/guide/': [
        {
          text: '使い方',
          items: [
            { text: 'はじめに', link: '/ja/guide/' },
            { text: 'インストール', link: '/ja/guide/installation' },
            { text: '基本的な使い方', link: '/ja/guide/usage' },
            { text: 'プロンプト例', link: '/ja/guide/prompt-examples' },
            { text: '出力フォーマット', link: '/ja/guide/output' },
            { text: 'コマンドラインオプション', link: '/ja/guide/command-line-options' },
            { text: 'リモートリポジトリの処理', link: '/ja/guide/remote-repository-processing' },
            { text: '設定', link: '/ja/guide/configuration' },
            { text: 'カスタム指示', link: '/ja/guide/custom-instructions' },
            { text: 'コメントの削除', link: '/ja/guide/comment-removal' },
            { text: 'セキュリティ', link: '/ja/guide/security' },
            {
              text: 'ヒント＆テクニック',
              items: [{ text: 'ベストプラクティス', link: '/ja/guide/tips/best-practices' }],
            },
            {
              text: '開発',
              items: [
                { text: '開発への貢献', link: '/ja/guide/development/' },
                { text: '環境構築', link: '/ja/guide/development/setup' },
              ],
            },
          ],
        },
      ],
    },
  },
});
