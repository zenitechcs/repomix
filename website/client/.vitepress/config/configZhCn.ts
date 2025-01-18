import { type DefaultTheme, defineConfig } from 'vitepress';

export const configZhCn = defineConfig({
  lang: 'zh-cn',
  description: '将代码库打包成AI友好的格式',
  themeConfig: {
    nav: [
      { text: '指南', link: '/zh-cn/guide/' },
      { text: '加入Discord', link: 'https://discord.gg/wNYzTwZFku' },
    ],
    sidebar: {
      '/zh-cn/guide/': [
        {
          text: '指南',
          items: [
            { text: '入门指南', link: '/zh-cn/guide/' },
            { text: '安装', link: '/zh-cn/guide/installation' },
            { text: '基本用法', link: '/zh-cn/guide/usage' },
            { text: '提示示例', link: '/zh-cn/guide/prompt-examples' },
            { text: '输出格式', link: '/zh-cn/guide/output' },
            { text: '命令行选项', link: '/zh-cn/guide/command-line-options' },
            { text: '远程仓库处理', link: '/zh-cn/guide/remote-repository-processing' },
            { text: '配置', link: '/zh-cn/guide/configuration' },
            { text: '自定义指令', link: '/zh-cn/guide/custom-instructions' },
            { text: '注释移除', link: '/zh-cn/guide/comment-removal' },
            { text: '安全性', link: '/zh-cn/guide/security' },
            {
              text: '技巧与窍门',
              items: [{ text: '最佳实践', link: '/zh-cn/guide/tips/best-practices' }],
            },
            {
              text: '开发',
              items: [
                { text: '参与贡献', link: '/zh-cn/guide/development/' },
                { text: '环境搭建', link: '/zh-cn/guide/development/setup' },
              ],
            },
          ],
        },
      ],
    },
  },
});

export const configZhCnSearch: DefaultTheme.LocalSearchOptions['locales'] = {
  'zh-cn': {
    translations: {
      button: {
        buttonText: '搜索',
        buttonAriaLabel: '搜索',
      },
      modal: {
        noResultsText: '无结果',
        resetButtonTitle: '重置搜索',
        backButtonTitle: '返回',
        displayDetails: '显示详情',
        footer: {
          selectText: '选择',
          navigateText: '导航',
          closeText: '关闭',
        },
      },
    },
  },
};
