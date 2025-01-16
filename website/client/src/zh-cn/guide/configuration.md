# 配置

## 快速开始

创建配置文件：
```bash
repomix --init
```

## 配置文件

`repomix.config.json`：
```json
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "headerText": "自定义头部文本",
    "instructionFilePath": "repomix-instruction.md",
    "fileSummary": true,
    "directoryStructure": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "includeEmptyDirectories": false
  },
  "include": ["**/*"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": ["tmp/", "*.log"]
  },
  "security": {
    "enableSecurityCheck": true
  }
}
```

## 全局配置

创建全局配置：
```bash
repomix --init --global
```

配置文件位置：
- Windows: `%LOCALAPPDATA%\\Repomix\\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## 忽略模式

优先级顺序：
1. 命令行选项（`--ignore`）
2. .repomixignore 文件
3. .gitignore 文件
4. 默认模式

`.repomixignore` 示例：
```text
# 缓存目录
.cache/
tmp/

# 构建输出
dist/
build/

# 日志文件
*.log
```

## 默认忽略模式

内置的常用模式：
```text
node_modules/**
.git/**
coverage/**
dist/**
```

完整列表：[defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)
