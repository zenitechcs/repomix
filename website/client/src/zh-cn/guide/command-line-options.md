# 命令行选项

## 基本选项
- `-v, --version`: 显示版本

## 输出选项
- `-o, --output <file>`: 输出文件名（默认值: `repomix-output.txt`）
- `--style <type>`: 输出格式（`plain`, `xml`, `markdown`）（默认值: `plain`）
- `--parsable-style`: 启用基于所选样式模式的可解析输出（默认值: `false`）
- `--output-show-line-numbers`: 添加行号（默认值: `false`）
- `--copy`: 复制到剪贴板（默认值: `false`）
- `--no-file-summary`: 禁用文件摘要（默认值: `true`）
- `--no-directory-structure`: 禁用目录结构（默认值: `true`）
- `--remove-comments`: 删除注释（默认值: `false`）
- `--remove-empty-lines`: 删除空行（默认值: `false`）
- `--header-text <text>`: 要包含在文件头部的自定义文本
- `--instruction-file-path <path>`: 包含详细自定义指令的文件路径
- `--include-empty-directories`: 在输出中包含空目录（默认值: `false`）

## 过滤选项
- `--include <patterns>`: 包含模式（逗号分隔）
- `-i, --ignore <patterns>`: 排除模式（逗号分隔）
- `--no-gitignore`: 禁用 .gitignore 文件
- `--no-default-patterns`: 禁用默认模式

## 远程仓库选项
- `--remote <url>`: 处理远程仓库
- `--remote-branch <name>`: 指定远程分支名称、标签或提交哈希（默认为仓库的默认分支）

## 配置选项
- `-c, --config <path>`: 自定义配置文件路径
- `--init`: 创建配置文件
- `--global`: 使用全局配置

## 安全选项
- `--no-security-check`: 禁用安全检查（默认值: `true`）

## 令牌计数选项
- `--token-count-encoding <encoding>`: 指定令牌计数编码（例如：`o200k_base`, `cl100k_base`）（默认值: `o200k_base`）

## 其他选项
- `--top-files-len <number>`: 要显示的顶部文件数量（默认值: `5`）
- `--verbose`: 启用详细日志

## 使用示例

```bash
# 基本用法
repomix

# 自定义输出
repomix -o output.xml --style xml

# 处理特定文件
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# 指定分支的远程仓库
repomix --remote https://github.com/user/repo/tree/main

# 指定提交的远程仓库
repomix --remote https://github.com/user/repo/commit/836abcd7335137228ad77feb28655d85712680f1

# 简写形式的远程仓库
repomix --remote user/repo
```
