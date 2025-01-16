import { defineConfig } from 'vitepress';

export const configEs = defineConfig({
  lang: 'es',
  description: 'Empaqueta tu código en formatos compatibles con la inteligencia artificial',
  themeConfig: {
    nav: [
      // guía
      { text: 'Guía', link: '/es/guide/' },
      { text: 'Únete a Discord', link: 'https://discord.gg/wNYzTwZFku' },
    ],
    sidebar: {
      '/es/guide/': [
        {
          text: 'Guía',
          items: [
            { text: 'Introducción', link: '/es/guide/' },
            { text: 'Instalación', link: '/es/guide/installation' },
            { text: 'Uso Básico', link: '/es/guide/usage' },
            { text: 'Ejemplos de Prompt', link: '/es/guide/prompt-examples' },
            { text: 'Formatos de Salida', link: '/es/guide/output' },
            { text: 'Opciones de Línea de Comando', link: '/es/guide/command-line-options' },
            { text: 'Procesamiento de Repositorios Remotos', link: '/es/guide/remote-repository-processing' },
            { text: 'Configuración', link: '/es/guide/configuration' },
            { text: 'Instrucciones Personalizadas', link: '/es/guide/custom-instructions' },
            { text: 'Eliminación de Comentarios', link: '/es/guide/comment-removal' },
            { text: 'Seguridad', link: '/es/guide/security' },
            {
              text: 'Consejos y Trucos',
              items: [{ text: 'Mejores Prácticas', link: '/es/guide/tips/best-practices' }],
            },
            {
              text: 'Desarrollo',
              items: [
                { text: 'Contribuir', link: '/es/guide/development/' },
                { text: 'Configuración Inicial', link: '/es/guide/development/setup' },
              ],
            },
          ],
        },
      ],
    },
  },
});
