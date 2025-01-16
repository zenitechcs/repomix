# 설정

## 빠른 시작

설정 파일 생성:
```bash
repomix --init
```

## 설정 파일

`repomix.config.json`:
```json
{
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "headerText": "사용자 정의 헤더 텍스트",
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

## 전역 설정

전역 설정 생성:
```bash
repomix --init --global
```

설정 파일 위치:
- Windows: `%LOCALAPPDATA%\\Repomix\\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## 제외 패턴

우선순위 순서:
1. 명령행 옵션 (`--ignore`)
2. .repomixignore
3. .gitignore
4. 기본 패턴

`.repomixignore` 예시:
```text
# 캐시 디렉토리
.cache/
tmp/

# 빌드 출력
dist/
build/

# 로그
*.log
```

## 기본 제외 패턴

기본적으로 포함되는 일반적인 패턴:
```text
node_modules/**
.git/**
coverage/**
dist/**
```

전체 목록: [defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)
