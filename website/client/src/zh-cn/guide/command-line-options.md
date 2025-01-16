# 命令行选项

## 基本选项

```bash
repomix [directory]  # 处理指定目录（默认为当前目录 "."）
```

## 输出选项

| 选项 | 说明 | 默认值 |
|--------|-------------|---------|
| `-o, --output <file>` | 输出文件名 | `repomix-output.txt` |
| `--style <type>` | 输出格式（`plain`, `xml`, `markdown`） | `plain` |
| `--output-show-line-numbers` | 添加行号 | `false` |
| `--copy` | 复制到剪贴板 | `false` |
| `--no-file-summary` | 禁用文件概要 | `true` |
| `--no-directory-structure` | 禁用目录结构 | `true` |
| `--remove-comments` | 移除注释 | `false` |
| `--remove-empty-lines` | 移除空行 | `false` |

## 过滤选项

| 选项 | 说明 |
|--------|-------------|
| `--include <patterns>` | 包含模式（逗号分隔） |
| `-i, --ignore <patterns>` | 忽略模式（逗号分隔） |

## 远程仓库

| 选项 | 说明 |
|--------|-------------|
| `--remote <url>` | 处理远程仓库 |
| `--remote-branch <name>` | 指定分支/标签/提交 |

## 配置

| 选项 | 说明 |
|--------|-------------|
| `-c, --config <path>` | 自定义配置文件路径 |
| `--init` | 创建配置文件 |
| `--global` | 使用全局配置 |

## 安全

| 选项 | 说明 | 默认值 |
|--------|-------------|---------|
| `--no-security-check` | 禁用安全检查 | `true` |

## 其他选项

| 选项 | 说明 |
|--------|-------------|
| `-v, --version` | 显示版本 |
| `--verbose` | 启用详细日志 |
| `--top-files-len <number>` | 显示的顶部文件数量 | `5` |

## 使用示例

```bash
# 基本用法
repomix

# 自定义输出
repomix -o output.xml --style xml

# 处理特定文件
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# 远程仓库
repomix --remote user/repo --remote-branch main
```
