import { type DefaultTheme, defineConfig } from 'vitepress';

export const configDe = defineConfig({
  lang: 'de',
  description: 'Verpacken Sie Ihren Code in AI-freundliche Formate',
  themeConfig: {
    nav: [
      // guide
      { text: 'Anleitung', link: '/de/guide/' },
      { text: 'Discord beitreten', link: 'https://discord.gg/wNYzTwZFku' },
    ],
    sidebar: {
      '/de/guide/': [
        {
          text: 'Anleitung',
          items: [
            { text: 'Erste Schritte', link: '/de/guide/' },
            { text: 'Installation', link: '/de/guide/installation' },
            { text: 'Verwendung', link: '/de/guide/usage' },
            { text: 'Prompt-Beispiele', link: '/de/guide/prompt-examples' },
            { text: 'Ausgabeformate', link: '/de/guide/output' },
            { text: 'Befehlszeilenoptionen', link: '/de/guide/command-line-options' },
            { text: 'Remote-Repository-Verarbeitung', link: '/de/guide/remote-repository-processing' },
            { text: 'Konfiguration', link: '/de/guide/configuration' },
            { text: 'Benutzerdefinierte Anweisungen', link: '/de/guide/custom-instructions' },
            { text: 'Kommentarentfernung', link: '/de/guide/comment-removal' },
            { text: 'Sicherheit', link: '/de/guide/security' },
            {
              text: 'Tipps & Tricks',
              items: [{ text: 'Best Practices', link: '/de/guide/tips/best-practices' }],
            },
            {
              text: 'Entwicklung',
              items: [
                { text: 'Beitragen', link: '/de/guide/development/' },
                { text: 'Einrichtung', link: '/de/guide/development/setup' },
              ],
            },
          ],
        },
      ],
    },
  },
});

export const configDeSearch: DefaultTheme.LocalSearchOptions['locales'] = {
  de: {
    translations: {
      button: {
        buttonText: 'Suchen',
        buttonAriaLabel: 'Suchen',
      },
      modal: {
        displayDetails: 'Detaillierte Liste anzeigen',
        resetButtonTitle: 'Suche zurücksetzen',
        backButtonTitle: 'Schließen',
        noResultsText: 'Keine Ergebnisse für',
        footer: {
          selectText: 'zum Auswählen',
          navigateText: 'zur Navigation',
          closeText: 'zum Schließen',
        },
      },
    },
  },
};
