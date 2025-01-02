import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Repomix",
  description: "Transform repositories into AI-friendly formats",
  themeConfig: {
    logo: { src: '/repomix-logo.svg', width: 24, height: 24 },
    nav: [
      { text: 'GitHub', link: 'https://github.com/yamadashy/repomix' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Kazuki Yamada'
    }
  },
  head: [['link', { rel: 'icon', href: '/repomix-logo.svg' }]],
})
