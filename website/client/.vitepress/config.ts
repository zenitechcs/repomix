import { defineConfig } from 'vitepress';
import { configEn } from './config/configEn';

const googleAnalyticsTag = 'G-7PTT4PLC69';

/**
 * Vitepress Configuration
 *
 * Reference
 * see: https://github.com/vuejs/vitepress/tree/main/docs
 */
export default defineConfig({
  title: 'Repomix',

  srcDir: 'src',

  rewrites: {
    // rewrite to `en` locale
    'en/:rest*': ':rest*',
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  sitemap: {
    hostname: 'http://repomix.com/',
  },

  // Shared configuration
  themeConfig: {
    logo: { src: '/images/repomix-logo.svg', width: 24, height: 24 },
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'discord', link: 'https://discord.gg/wNYzTwZFku' },
      { icon: 'github', link: 'https://github.com/yamadashy/repomix' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Kazuki Yamada',
    },
  },

  // i18n configuration
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      ...configEn,
    },
  },

  head: [
    // Favicon
    ['link', { rel: 'icon', href: '/images/repomix-logo.svg' }],

    // OGP
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Repomix' }],
    ['meta', { property: 'og:site_name', content: 'Repomix' }],
    ['meta', { property: 'og:image', content: 'https://repomix.com/images/og-image-large.png' }],
    ['meta', { property: 'og:url', content: 'https://repomix.com' }],
    ['meta', { property: 'og:description', content: 'Pack your codebase into AI-friendly formats' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:domain', content: 'https://repomix.com' }],
    ['meta', { property: 'twitter:url', content: 'https://repomix.com' }],
    ['meta', { name: 'twitter:title', content: 'Repomix' }],
    ['meta', { name: 'twitter:description', content: 'Pack your codebase into AI-friendly formats' }],
    ['meta', { name: 'twitter:image', content: 'https://repomix.com/images/og-image-large.png' }],
    ['meta', { name: 'thumbnail', content: 'https://repomix.com/images/og-image-large.png' }],

    // PWA
    ['meta', { name: 'theme-color', content: '#f97316' }],

    // Google Analytics
    [
      'script',
      {
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsTag}`,
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsTag}');`,
    ],
  ],
});
