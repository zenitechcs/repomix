# 配置

## 快速开始

创建配置文件：
```bash
repomix --init
```

## 配置选项

| 选项                             | 说明                                                                                                                         | 默认值                 |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `input.maxFileSize`              | 要处理的最大文件大小（字节）。超过此大小的文件将被跳过                                                                      | `50000000`            |
| `output.filePath`                | 输出文件名                                                                                                                   | `"repomix-output.xml"` |
| `output.style`                   | 输出样式（`xml`、`markdown`、`plain`）                                                                                       | `"xml"`                |
| `output.parsableStyle`           | 是否根据所选样式模式转义输出。注意这可能会增加令牌数量                                                                      | `false`                |
| `output.compress`                | 是否执行智能代码提取以减少令牌数量                                                                                          | `false`                |
| `output.headerText`              | 要包含在文件头部的自定义文本                                                                                                | `null`                 |
| `output.instructionFilePath`     | 包含详细自定义指令的文件路径                                                                                                | `null`                 |
| `output.fileSummary`             | 是否在输出开头包含摘要部分                                                                                                  | `true`                 |
| `output.directoryStructure`      | 是否在输出中包含目录结构                                                                                                    | `true`                 |
| `output.files`                   | 是否在输出中包含文件内容                                                                                                    | `true`                 |
| `output.removeComments`          | 是否从支持的文件类型中删除注释                                                                                              | `false`                |
| `output.removeEmptyLines`        | 是否从输出中删除空行                                                                                                        | `false`                |
| `output.showLineNumbers`         | 是否为每行添加行号                                                                                                          | `false`                |
| `output.copyToClipboard`         | 是否除了保存文件外还将输出复制到系统剪贴板                                                                                  | `false`                |
| `output.topFilesLength`          | 在摘要中显示的顶部文件数量。如果设置为0，则不显示摘要                                                                       | `5`                    |
| `output.includeEmptyDirectories` | 是否在仓库结构中包含空目录                                                                                                  | `false`                |
| `output.git.sortByChanges`       | 是否按Git更改次数对文件进行排序（更改较多的文件显示在底部）                                                                | `true`                 |
| `output.git.sortByChangesMaxCommits` | 分析Git更改时要分析的最大提交数                                                                                         | `100`                  |
| `output.git.includeDiffs`        | 是否在输出中包含Git差异（分别包含工作树和暂存区的更改）                                                                     | `false`                |
| `include`                        | 要包含的文件模式（使用[glob模式](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)）                   | `[]`                   |
| `ignore.useGitignore`            | 是否使用项目的`.gitignore`文件中的模式                                                                                      | `true`                 |
| `ignore.useDefaultPatterns`      | 是否使用默认忽略模式                                                                                                        | `true`                 |
| `ignore.customPatterns`          | 额外的忽略模式（使用[glob模式](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)）                    | `[]`                   |
| `security.enableSecurityCheck`   | 是否对文件执行安全检查                                                                                                      | `true`                 |
| `tokenCount.encoding`            | OpenAI的[tiktoken](https://github.com/openai/tiktoken)分词器使用的令牌计数编码（例如：GPT-4o使用`o200k_base`，GPT-4/3.5使用`cl100k_base`）。详见[tiktoken model.py](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py#L24)。 | `"o200k_base"`         |

配置文件支持[JSON5](https://json5.org/)语法，允许：
- 注释（单行和多行）
- 对象和数组中的尾随逗号
- 无引号属性名
- 更灵活的字符串语法

## 配置文件示例

以下是完整配置文件（`repomix.config.json`）的示例：

```json
{
  "input": {
    "maxFileSize": 50000000
  },
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "parsableStyle": false,
    "compress": false,
    "headerText": "打包文件的自定义头部信息",
    "fileSummary": true,
    "directoryStructure": true,
    "files": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "includeEmptyDirectories": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": false
    }
  },
  "include": ["**/*"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    // 模式也可以在 .repomixignore 中指定
    "customPatterns": [
      "additional-folder",
      "**/*.log"
    ],
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
```

## 全局配置

创建全局配置：
```bash
repomix --init --global
```

位置：
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## 忽略模式

优先级：
1. CLI选项（`--ignore`）
2. `.repomixignore`
3. `.gitignore`和`.git/info/exclude`
4. 默认模式

`.repomixignore`示例：
```text
# 缓存目录
.cache/
tmp/

# 构建输出
dist/
build/

# 日志
*.log
```

## 默认忽略模式

默认包含的常见模式：
```text
node_modules/**
.git/**
coverage/**
dist/**
```

完整列表：[defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)

## 示例

### 代码压缩

当`output.compress`设置为`true`时，Repomix将提取基本代码结构，同时移除实现细节。这可以在保持重要的结构信息的同时减少令牌数量。

更多详细信息和示例，请参阅[代码压缩指南](code-compress)。

### Git集成

`output.git`配置允许您控制如何基于Git历史记录对文件进行排序以及如何包含Git差异：

- `sortByChanges`：当设置为`true`时，文件将按Git更改次数（修改该文件的提交数）进行排序。更改次数较多的文件将出现在输出的底部。这有助于优先处理更活跃开发的文件。默认值：`true`
- `sortByChangesMaxCommits`：计算文件更改次数时要分析的最大提交数。默认值：`100`
- `includeDiffs`：当设置为`true`时，在输出中包含Git差异（同时分别包含工作树和暂存区的更改）。这允许读者查看存储库中的待处理更改。默认值：`false`

配置示例：
```json
{
  "output": {
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": true
    }
  }
}
```

### 注释移除

当`output.removeComments`设置为`true`时，将从支持的文件类型中移除注释，以减少输出大小并专注于核心代码内容。

有关支持的语言和详细示例，请参阅[注释移除指南](comment-removal)。
