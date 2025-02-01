# 开发环境搭建

## 前提条件

- Node.js ≥ 18.0.0
- Git
- npm

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/yamadashy/repomix.git
cd repomix

# 安装依赖
npm install

# 运行 CLI
npm run repomix
```

## Docker 开发环境

```bash
# 构建镜像
docker build -t repomix .

# 运行容器
docker run -v ./:/app -it --rm repomix
```

## 项目结构

```
src/
├── cli/          # CLI 实现
├── config/       # 配置处理
├── core/         # 核心功能
└── shared/       # 共享工具
```

## 测试

```bash
# 运行测试
npm run test

# 测试覆盖率
npm run test-coverage

# 代码检查
npm run lint-biome
npm run lint-ts
npm run lint-secretlint
```

## 发布流程

1. 更新版本
```bash
npm version patch  # 或 minor/major
```

2. 运行测试和构建
```bash
npm run test-coverage
npm run build
```

3. 发布
```bash
npm publish
```
