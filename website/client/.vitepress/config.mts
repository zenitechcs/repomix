import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Repomix",
  description: "Packs your entire repository into AI-friendly formats",
  lastUpdated: true,
  metaChunk: true,
  sitemap: {
    hostname: 'http://repomix.com/'
  },
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
  head: [
    ['link', { rel: 'icon', href: '/repomix-logo.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Repomix' }],
    ['meta', { property: 'og:site_name', content: 'Repomix' }],
    ['meta', { property: 'og:image', content: 'http://repomix.com/og-image.png' }],
    ['meta', { property: 'og:url', content: 'http://repomix.com/' }],
    ['meta', { property: 'og:description', content: 'Packs your entire repository into AI-friendly formats' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' }],
    ['meta', { name: 'theme-color', content: '#f97316' }],
  ],
})
