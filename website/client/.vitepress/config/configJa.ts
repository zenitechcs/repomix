import { type DefaultTheme, defineConfig } from 'vitepress';

export const configJa = defineConfig({
  lang: 'ja',
  description: 'コードベースをAIフレンドリーな形式にパッケージング',
  themeConfig: {
    nav: [
      // guide
      { text: '使い方', link: '/ja/guide/', activeMatch: '^/ja/guide/' },
      { text: 'Discordに参加', link: 'https://discord.gg/wNYzTwZFku' },
    ],
    sidebar: {
      '/ja/guide/': [
        {
          text: 'はじめに',
          items: [
            { text: 'はじめに', link: '/ja/guide/' },
            { text: 'インストール', link: '/ja/guide/installation' },
            { text: '基本的な使い方', link: '/ja/guide/usage' },
            { text: 'プロンプト例', link: '/ja/guide/prompt-examples' },
          ],
        },
        {
          text: '使い方',
          items: [
            { text: '出力フォーマット', link: '/ja/guide/output' },
            { text: 'コマンドラインオプション', link: '/ja/guide/command-line-options' },
            { text: '設定', link: '/ja/guide/configuration' },
            { text: 'カスタム指示', link: '/ja/guide/custom-instructions' },
            { text: 'リモートリポジトリの処理', link: '/ja/guide/remote-repository-processing' },
            { text: 'コメントの削除', link: '/ja/guide/comment-removal' },
            { text: 'コード圧縮', link: '/ja/guide/code-compress' },
            { text: 'セキュリティ', link: '/ja/guide/security' },
            { text: 'MCPサーバー', link: '/ja/guide/mcp-server' },
            { text: 'GitHub Actions', link: '/ja/guide/github-actions' },
          ],
        },
        {
          text: '高度な使い方',
          items: [
            { text: 'ライブラリとしての使用', link: '/ja/guide/development/using-repomix-as-a-library' },
            { text: 'AI支援開発のヒント', link: '/ja/guide/tips/best-practices' },
            { text: 'Repomixへの貢献', link: '/ja/guide/development/' },
            { text: '開発環境構築', link: '/ja/guide/development/setup' },
          ],
        },
      ],
    },
  },
});

export const configJaSearch: DefaultTheme.LocalSearchOptions['locales'] = {
  ja: {
    translations: {
      button: {
        buttonText: '検索',
        buttonAriaLabel: '検索',
      },
      modal: {
        noResultsText: '検索結果がありません',
        resetButtonTitle: '検索をリセット',
        backButtonTitle: '前に戻る',
        displayDetails: '詳細を表示',
        footer: {
          selectText: '選択',
          navigateText: '移動',
          closeText: '閉じる',
        },
      },
    },
  },
};
