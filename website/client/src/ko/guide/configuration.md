# 설정

## 빠른 시작

설정 파일 생성:
```bash
repomix --init
```

## 설정 옵션

| 옵션                             | 설명                                                                                                                         | 기본값                 |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `input.maxFileSize`              | 처리할 최대 파일 크기(바이트). 이보다 큰 파일은 건너뜁니다                                                                  | `50000000`            |
| `output.filePath`                | 출력 파일 이름                                                                                                               | `"repomix-output.xml"` |
| `output.style`                   | 출력 스타일(`xml`, `markdown`, `plain`)                                                                                      | `"xml"`                |
| `output.parsableStyle`           | 선택한 스타일 스키마에 따라 출력을 이스케이프할지 여부. 토큰 수가 증가할 수 있습니다                                       | `false`                |
| `output.compress`                | 토큰 수를 줄이기 위해 지능형 코드 추출을 수행할지 여부                                                                      | `false`                |
| `output.headerText`              | 파일 헤더에 포함할 사용자 정의 텍스트                                                                                       | `null`                 |
| `output.instructionFilePath`     | 상세한 사용자 정의 지침이 포함된 파일 경로                                                                                  | `null`                 |
| `output.fileSummary`             | 출력 시작 부분에 요약 섹션을 포함할지 여부                                                                                  | `true`                 |
| `output.directoryStructure`      | 출력에 디렉토리 구조를 포함할지 여부                                                                                        | `true`                 |
| `output.files`                   | 출력에 파일 내용을 포함할지 여부                                                                                            | `true`                 |
| `output.removeComments`          | 지원되는 파일 유형에서 주석을 제거할지 여부                                                                                 | `false`                |
| `output.removeEmptyLines`        | 출력에서 빈 줄을 제거할지 여부                                                                                              | `false`                |
| `output.showLineNumbers`         | 각 줄에 줄 번호를 추가할지 여부                                                                                             | `false`                |
| `output.copyToClipboard`         | 파일 저장 외에도 출력을 시스템 클립보드에 복사할지 여부                                                                     | `false`                |
| `output.topFilesLength`          | 요약에 표시할 상위 파일 수. 0으로 설정하면 요약이 표시되지 않습니다                                                         | `5`                    |
| `output.includeEmptyDirectories` | 저장소 구조에 빈 디렉토리를 포함할지 여부                                                                                   | `false`                |
| `output.git.sortByChanges`       | Git 변경 횟수로 파일을 정렬할지 여부(변경이 많은 파일이 하단에 표시됨)                                                     | `true`                 |
| `output.git.sortByChangesMaxCommits` | Git 변경을 분석할 때 분석할 최대 커밋 수                                                                                | `100`                  |
| `output.git.includeDiffs`        | 출력에 Git 차이를 포함할지 여부(작업 트리와 스테이징된 변경 사항을 별도로 포함)                                            | `false`                |
| `include`                        | 포함할 파일 패턴([glob 패턴](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax) 사용)                   | `[]`                   |
| `ignore.useGitignore`            | 프로젝트의 `.gitignore` 파일의 패턴을 사용할지 여부                                                                         | `true`                 |
| `ignore.useDefaultPatterns`      | 기본 무시 패턴을 사용할지 여부                                                                                              | `true`                 |
| `ignore.customPatterns`          | 추가 무시 패턴([glob 패턴](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax) 사용)                    | `[]`                   |
| `security.enableSecurityCheck`   | 파일에 대한 보안 검사를 수행할지 여부                                                                                       | `true`                 |
| `tokenCount.encoding`            | OpenAI의 [tiktoken](https://github.com/openai/tiktoken) 토크나이저가 사용하는 토큰 카운트 인코딩(예: GPT-4o의 경우 `o200k_base`, GPT-4/3.5의 경우 `cl100k_base`). 자세한 내용은 [tiktoken model.py](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py#L24) 참조. | `"o200k_base"`         |

설정 파일은 [JSON5](https://json5.org/) 구문을 지원하며, 다음을 허용합니다:
- 주석(한 줄 및 여러 줄)
- 객체와 배열의 후행 쉼표
- 따옴표 없는 속성 이름
- 더 유연한 문자열 구문

## 설정 파일 예시

다음은 전체 설정 파일(`repomix.config.json`)의 예시입니다:

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
    "headerText": "패키지된 파일의 사용자 정의 헤더 정보",
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
    // 패턴은 .repomixignore에서도 지정할 수 있습니다
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

## 전역 설정

전역 설정 생성:
```bash
repomix --init --global
```

위치:
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## 무시 패턴

우선순위:
1. CLI 옵션(`--ignore`)
2. `.repomixignore`
3. `.gitignore`와 `.git/info/exclude`
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

## 기본 무시 패턴

기본적으로 포함되는 일반적인 패턴:
```text
node_modules/**
.git/**
coverage/**
dist/**
```

전체 목록: [defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)

## 예시

### 코드 압축

`output.compress`를 `true`로 설정하면, Repomix는 구현 세부 사항을 제거하면서 기본 코드 구조를 추출합니다. 이는 중요한 구조 정보를 유지하면서 토큰 수를 줄일 수 있습니다.

자세한 정보와 예시는 [코드 압축 가이드](code-compress)를 참조하세요.

### Git 통합

`output.git` 설정을 통해 Git 히스토리를 기반으로 파일을 정렬하는 방법과 Git 차이를 포함하는 방법을 제어할 수 있습니다:

- `sortByChanges`: `true`로 설정하면, 파일은 Git 변경 횟수(해당 파일을 수정한 커밋 수)로 정렬됩니다. 변경이 많은 파일이 출력의 하단에 표시됩니다. 이는 더 활발하게 개발되는 파일을 우선순위로 처리하는 데 도움이 됩니다. 기본값: `true`
- `sortByChangesMaxCommits`: 파일 변경 횟수를 계산할 때 분석할 최대 커밋 수. 기본값: `100`
- `includeDiffs`: `true`로 설정하면, 출력에 Git 차이를 포함합니다(작업 트리와 스테이징된 변경 사항을 별도로 포함). 이를 통해 독자는 저장소의 대기 중인 변경 사항을 확인할 수 있습니다. 기본값: `false`

설정 예시:
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

### 주석 제거

`output.removeComments`를 `true`로 설정하면, 지원되는 파일 유형에서 주석이 제거되어 출력 크기를 줄이고 핵심 코드 내용에 집중할 수 있습니다.

지원되는 언어와 자세한 예시는 [주석 제거 가이드](comment-removal)를 참조하세요.
