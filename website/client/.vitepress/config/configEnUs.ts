import { defineConfig } from 'vitepress';

export const configEnUs = defineConfig({
  lang: 'en-US',
  description: 'Pack your codebase into AI-friendly formats',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Join Discord', link: 'https://discord.gg/wNYzTwZFku' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/', activeMatch: '^/guide/$' },
            { text: 'Installation', link: '/guide/installation', activeMatch: '^/guide/installation' },
            { text: 'Basic Usage', link: '/guide/usage', activeMatch: '^/guide/usage' },
            { text: 'Prompt Examples', link: '/guide/prompt-examples', activeMatch: '^/guide/prompt-examples' },
          ],
        },
        {
          text: 'Guide',
          items: [
            { text: 'Output Formats', link: '/guide/output', activeMatch: '^/guide/output' },
            { text: 'Command Line Options', link: '/guide/command-line-options', activeMatch: '^/guide/command-line-options' },
            { text: 'Configuration', link: '/guide/configuration', activeMatch: '^/guide/configuration' },
            { text: 'Custom Instructions', link: '/guide/custom-instructions', activeMatch: '^/guide/custom-instructions' },
            { text: 'Remote Repository Processing', link: '/guide/remote-repository-processing', activeMatch: '^/guide/remote-repository-processing' },
            { text: 'Comment Removal', link: '/guide/comment-removal', activeMatch: '^/guide/comment-removal' },
            { text: 'Code Compression', link: '/guide/code-compress', activeMatch: '^/guide/code-compress' },
            { text: 'Security', link: '/guide/security', activeMatch: '^/guide/security' },
            { text: 'MCP Server', link: '/guide/mcp-server', activeMatch: '^/guide/mcp-server' },
            { text: 'GitHub Actions', link: '/guide/github-actions', activeMatch: '^/guide/github-actions' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Using Repomix as a Library', link: '/guide/development/using-repomix-as-a-library', activeMatch: '^/guide/development/using-repomix-as-a-library' },
            { text: 'Best Practices', link: '/guide/tips/best-practices', activeMatch: '^/guide/tips/best-practices' },
            { text: 'Contributing to Repomix', link: '/guide/development/', activeMatch: '^/guide/development/' },
            { text: 'Development Setup', link: '/guide/development/setup', activeMatch: '^/guide/development/setup' },
          ],
        },
      ],
    },
  },
});
