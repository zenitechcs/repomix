# 명령줄 옵션

## 기본 옵션
- `-v, --version`: 버전 표시

## 출력 옵션
- `-o, --output <file>`: 출력 파일 이름 (기본값: `repomix-output.txt`)
- `--style <type>`: 출력 형식 (`plain`, `xml`, `markdown`) (기본값: `plain`)
- `--parsable-style`: 선택한 스타일 스키마에 따라 파싱 가능한 출력 활성화 (기본값: `false`)
- `--output-show-line-numbers`: 줄 번호 추가 (기본값: `false`)
- `--copy`: 클립보드에 복사 (기본값: `false`)
- `--no-file-summary`: 파일 요약 비활성화 (기본값: `true`)
- `--no-directory-structure`: 디렉토리 구조 비활성화 (기본값: `true`)
- `--remove-comments`: 주석 제거 (기본값: `false`)
- `--remove-empty-lines`: 빈 줄 제거 (기본값: `false`)
- `--header-text <text>`: 파일 헤더에 포함할 사용자 정의 텍스트
- `--instruction-file-path <path>`: 상세 사용자 정의 지시사항이 포함된 파일 경로
- `--include-empty-directories`: 빈 디렉토리를 출력에 포함 (기본값: `false`)

## 필터 옵션
- `--include <patterns>`: 포함 패턴 (쉼표로 구분)
- `-i, --ignore <patterns>`: 제외 패턴 (쉼표로 구분)
- `--no-gitignore`: .gitignore 파일 사용 비활성화
- `--no-default-patterns`: 기본 패턴 비활성화

## 원격 저장소 옵션
- `--remote <url>`: 원격 저장소 처리
- `--remote-branch <name>`: 원격 브랜치 이름, 태그 또는 커밋 해시 지정 (기본값은 저장소의 기본 브랜치)

## 설정 옵션
- `-c, --config <path>`: 사용자 정의 설정 파일 경로
- `--init`: 설정 파일 생성
- `--global`: 전역 설정 사용

## 보안 옵션
- `--no-security-check`: 보안 검사 비활성화 (기본값: `true`)

## 토큰 카운트 옵션
- `--token-count-encoding <encoding>`: 토큰 카운트 인코딩 지정 (예: `o200k_base`, `cl100k_base`) (기본값: `o200k_base`)

## 기타 옵션
- `--top-files-len <number>`: 표시할 상위 파일 수 (기본값: `5`)
- `--verbose`: 상세 로그 활성화

## 사용 예시

```bash
# 기본 사용법
repomix

# 사용자 정의 출력
repomix -o output.xml --style xml

# 특정 파일 처리
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# 브랜치를 지정한 원격 저장소
repomix --remote https://github.com/user/repo/tree/main

# 커밋을 지정한 원격 저장소
repomix --remote https://github.com/user/repo/commit/836abcd7335137228ad77feb28655d85712680f1

# 단축형 원격 저장소
repomix --remote user/repo
```
