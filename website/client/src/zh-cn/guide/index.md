# Repomix 入门指南

Repomix 是一个将代码库打包成单个 AI 友好文件的工具。它专为帮助你将代码提供给大型语言模型（如 ChatGPT、DeepSeek、Perplexity、Gemini、Gemma、Llama、Grok 等）而设计。

[![npm](https://img.shields.io/npm/v/repomix.svg?maxAge=1000)](https://www.npmjs.com/package/repomix)
[![npm](https://img.shields.io/npm/d18m/repomix)](https://www.npmjs.com/package/repomix)
[![Actions Status](https://github.com/yamadashy/repomix/actions/workflows/ci.yml/badge.svg)](https://github.com/yamadashy/repomix/actions?query=workflow%3A"ci")
[![codecov](https://codecov.io/github/yamadashy/repomix/graph/badge.svg)](https://codecov.io/github/yamadashy/repomix)
[![Sponsors](https://img.shields.io/github/sponsors/yamadashy?logo=github)](https://github.com/sponsors/yamadashy)
[![Discord](https://badgen.net/discord/online-members/wNYzTwZFku?icon=discord&label=discord)](https://discord.gg/wNYzTwZFku)

## 快速开始

在你的项目目录中运行以下命令：

```bash
npx repomix
```

就这么简单！你会在当前目录中找到一个 `repomix-output.xml` 文件，其中包含了以 AI 友好格式整理的整个代码库。

然后，你可以将此文件发送给 AI 助手，并附上类似这样的提示：

```
这个文件包含了仓库中所有文件的合并内容。
我想重构代码，请先帮我审查一下。
```

AI 将分析你的整个代码库并提供全面的见解：

![Repomix 使用示例1](/images/docs/repomix-file-usage-1.png)

在讨论具体修改时，AI 可以帮助生成代码。通过像 Claude 的 Artifacts 这样的功能，你甚至可以一次性接收多个相互依赖的文件：

![Repomix 使用示例2](/images/docs/repomix-file-usage-2.png)

祝你编码愉快！🚀

## 核心功能

- **AI 优化**：以 AI 易于理解的格式整理代码库
- **令牌计数**：为 LLM 上下文限制提供令牌使用统计
- **Git 感知**：自动识别并遵循 `.gitignore` 和 `.git/info/exclude` 文件
- **注重安全**：使用 Secretlint 进行敏感信息检测
- **多种输出格式**：可选纯文本、XML 或 Markdown 格式

## 下一步

- [安装指南](installation.md)：了解安装 Repomix 的不同方式
- [使用指南](usage.md)：学习基本和高级功能
- [配置](configuration.md)：根据需求自定义 Repomix
- [安全功能](security.md)：了解安全检查详情

## 社区

加入我们的 [Discord 社区](https://discord.gg/wNYzTwZFku)：
- 获取 Repomix 使用帮助
- 分享你的使用经验
- 提出新功能建议
- 与其他用户交流

## 支持

发现问题或需要帮助？
- [在 GitHub 上提交问题](https://github.com/yamadashy/repomix/issues)
- 加入 Discord 服务器
- 查看[文档](https://repomix.com)
