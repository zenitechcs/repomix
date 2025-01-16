import { defineConfig } from 'vitepress';

export const configPtBr = defineConfig({
  lang: 'pt-br',
  description: 'Empacote seu código em formatos compatíveis com IA',
  themeConfig: {
    nav: [
      // guia
      { text: 'Guia', link: '/pt-br/guide/' },
      { text: 'Entrar no Discord', link: 'https://discord.gg/wNYzTwZFku' },
    ],
    sidebar: {
      '/pt-br/guide/': [
        {
          text: 'Guia',
          items: [
            { text: 'Introdução', link: '/pt-br/guide/' },
            { text: 'Instalação', link: '/pt-br/guide/installation' },
            { text: 'Uso Básico', link: '/pt-br/guide/usage' },
            { text: 'Exemplos de Prompt', link: '/pt-br/guide/prompt-examples' },
            { text: 'Formatos de Saída', link: '/pt-br/guide/output' },
            { text: 'Opções de Linha de Comando', link: '/pt-br/guide/command-line-options' },
            { text: 'Processamento de Repositórios Remotos', link: '/pt-br/guide/remote-repository-processing' },
            { text: 'Configuração', link: '/pt-br/guide/configuration' },
            { text: 'Instruções Personalizadas', link: '/pt-br/guide/custom-instructions' },
            { text: 'Remoção de Comentários', link: '/pt-br/guide/comment-removal' },
            { text: 'Segurança', link: '/pt-br/guide/security' },
            {
              text: 'Dicas e Truques',
              items: [{ text: 'Melhores Práticas', link: '/pt-br/guide/tips/best-practices' }],
            },
            {
              text: 'Desenvolvimento',
              items: [
                { text: 'Contribuindo', link: '/pt-br/guide/development/' },
                { text: 'Configuração Inicial', link: '/pt-br/guide/development/setup' },
              ],
            },
          ],
        },
      ],
    },
  },
});
