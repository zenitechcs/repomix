# Instalación

## Usando npx (no requiere instalación)

```bash
npx repomix
```

## Instalación global

### npm
```bash
npm install -g repomix
```

### Yarn
```bash
yarn global add repomix
```

### Homebrew (macOS/Linux)
```bash
brew install repomix
```

## Instalación con Docker

Extrae y ejecuta la imagen de Docker:

```bash
# Directorio actual
docker run -v .:/app -it --rm ghcr.io/yamadashy/repomix

# Directorio específico
docker run -v .:/app -it --rm ghcr.io/yamadashy/repomix ruta/al/directorio

# Repositorio remoto
docker run -v ./output:/app -it --rm ghcr.io/yamadashy/repomix --remote yamadashy/repomix
```

## Requisitos del sistema

- Node.js: ≥ 18.0.0
- Git: Requerido para el procesamiento de repositorios remotos

## Verificación

Después de la instalación, verifica que Repomix esté funcionando:

```bash
repomix --version
repomix --help
