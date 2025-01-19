# 설치

## npx 사용 (설치 불필요)

```bash
npx repomix
```

## 전역 설치

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

## Docker 설치

Docker를 사용하면 환경 설정 문제를 피할 수 있어 가장 편리한 방법 중 하나입니다. 아래와 같이 실행하세요:

```bash
# 현재 디렉토리 처리
docker run -v .:/app -it --rm ghcr.io/yamadashy/repomix

# 특정 디렉토리 처리
docker run -v .:/app -it --rm ghcr.io/yamadashy/repomix path/to/directory

# 원격 저장소 처리
docker run -v ./output:/app -it --rm ghcr.io/yamadashy/repomix --remote yamadashy/repomix
```

## 시스템 요구 사항

- Node.js: 18.0.0 이상
- Git: 원격 저장소 처리 시 필요

## 설치 확인

설치가 완료된 후, 다음 명령어로 Repomix가 정상적으로 작동하는지 확인하세요:

```bash
repomix --version
repomix --help
```
