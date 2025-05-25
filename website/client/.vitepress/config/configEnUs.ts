import { defineConfig } from 'vitepress';

export const configEnUs = defineConfig({
  lang: 'en-US',
  description: 'Pack your codebase into AI-friendly formats',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '^/guide/' },
      {
        text: 'Chrome Extension',
        link: 'https://chromewebstore.google.com/detail/repomix/fimfamikepjgchehkohedilpdigcpkoa',
      },
      { text: 'Join Discord', link: 'https://discord.gg/wNYzTwZFku' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Basic Usage', link: '/guide/usage' },
            { text: 'Prompt Examples', link: '/guide/prompt-examples' },
          ],
        },
        {
          text: 'Guide',
          items: [
            { text: 'Output Formats', link: '/guide/output' },
            { text: 'Command Line Options', link: '/guide/command-line-options' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Custom Instructions', link: '/guide/custom-instructions' },
            { text: 'Remote Repository Processing', link: '/guide/remote-repository-processing' },
            { text: 'Comment Removal', link: '/guide/comment-removal' },
            { text: 'Code Compression', link: '/guide/code-compress' },
            { text: 'Security', link: '/guide/security' },
            { text: 'MCP Server', link: '/guide/mcp-server' },
            { text: 'GitHub Actions', link: '/guide/github-actions' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Using Repomix as a Library', link: '/guide/development/using-repomix-as-a-library' },
            { text: 'AI-Assisted Development Tips', link: '/guide/tips/best-practices' },
            { text: 'Contributing to Repomix', link: '/guide/development/' },
          ],
        },
      ],
    },
  },
});
