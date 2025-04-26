# GitHub Actions에서 Repomix 사용하기

GitHub Actions 워크플로우에 Repomix를 통합하면 AI 분석을 위한 코드베이스 패킹을 자동화할 수 있습니다. 이는 CI, 코드 리뷰, LLM 도구 준비 등에 유용합니다.

## 기본 사용법

다음 스텝을 워크플로우 YAML에 추가하여 저장소를 패킹할 수 있습니다.

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    include: "**/*.ts"
    output: repomix-output.txt
```

## 여러 디렉터리 및 압축 옵션

여러 디렉터리, include/exclude 패턴, 스마트 압축도 지정할 수 있습니다.

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src tests
    include: "**/*.ts,**/*.md"
    ignore: "**/*.test.ts"
    output: repomix-output.txt
    compress: true
```

## 출력 파일을 아티팩트로 업로드

생성된 파일을 후속 스텝이나 다운로드용으로 업로드하는 예시입니다.

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    output: repomix-output.txt
    compress: true

- name: Upload Repomix output
  uses: actions/upload-artifact@v4
  with:
    name: repomix-output
    path: repomix-output.txt
```

## Action 입력 파라미터

| 이름                | 설명                                   | 기본값           |
|---------------------|----------------------------------------|------------------|
| `directories`       | 패킹할 디렉터리(공백 구분)             | `.`              |
| `include`           | 포함할 glob 패턴(쉼표 구분)            | `""`           |
| `ignore`            | 제외할 glob 패턴(쉼표 구분)            | `""`           |
| `output`            | 출력 파일 경로                          | `repomix.txt`    |
| `compress`          | 스마트 압축 활성화                      | `true`           |
| `additional-args`   | repomix CLI에 전달할 추가 인자          | `""`           |
| `repomix-version`   | 설치할 npm 패키지 버전                  | `latest`         |

## Action 출력

| 이름           | 설명                   |
|----------------|------------------------|
| `output-file`  | 생성된 출력 파일 경로   |

## 전체 워크플로우 예시

Repomix를 사용하는 GitHub Actions 워크플로우 전체 예시입니다.

```yaml
name: Pack and Upload Codebase
on:
  push:
    branches: [main]

jobs:
  pack:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Pack repository with Repomix
        uses: yamadashy/repomix/.github/actions/repomix@main
        with:
          directories: src
          include: "**/*.ts"
          output: repomix-output.txt
          compress: true
      - name: Upload Repomix output
        uses: actions/upload-artifact@v4
        with:
          name: repomix-output
          path: repomix-output.txt
``` 
