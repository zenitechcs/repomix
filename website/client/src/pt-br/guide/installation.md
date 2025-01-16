# Instalação

## Usando npx (Nenhuma Instalação Necessária)

```bash
npx repomix
```

## Instalação Global

### npm
```bash
npm install -g repomix
```

### Yarn
```bash
yarn global add repomix
```

### Homebrew (macOS)
```bash
brew install repomix
```

## Instalação via Docker

Baixe e execute a imagem Docker:

```bash
# Diretório atual
docker run -v .:/app -it --rm ghcr.io/yamadashy/repomix

# Diretório específico
docker run -v .:/app -it --rm ghcr.io/yamadashy/repomix path/to/directory

# Repositório remoto
docker run -v ./output:/app -it --rm ghcr.io/yamadashy/repomix --remote yamadashy/repomix
```

## Requisitos de Sistema

- Node.js: ≥ 18.0.0
- Git: Necessário para processamento de repositório remoto

## Verificação

Após a instalação, verifique se o Repomix está funcionando:

```bash
repomix --version
repomix --help
```
