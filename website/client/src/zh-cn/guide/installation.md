# 安装

## 使用 npx（无需安装）

```bash
npx repomix
```

## 全局安装

### npm 安装
```bash
npm install -g repomix
```

### Yarn 安装
```bash
yarn global add repomix
```

### Homebrew 安装（macOS）
```bash
brew install repomix
```

## Docker 安装

使用 Docker 是最便捷的方式之一，可以避免环境配置问题。以下是具体步骤：

```bash
# 处理当前目录
docker run -v .:/app -it --rm ghcr.io/yamadashy/repomix

# 处理指定目录
docker run -v .:/app -it --rm ghcr.io/yamadashy/repomix path/to/directory

# 处理远程仓库
docker run -v ./output:/app -it --rm ghcr.io/yamadashy/repomix --remote yamadashy/repomix
```

## 系统要求

- Node.js: ≥ 18.0.0
- Git: 处理远程仓库时需要

## 验证安装

安装完成后，可以通过以下命令验证 Repomix 是否正常工作：

```bash
repomix --version
repomix --help
```
