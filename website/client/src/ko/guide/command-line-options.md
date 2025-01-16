# 명령행 옵션

## 기본 옵션

```bash
repomix [directory]  # 특정 디렉토리 처리 (기본값: ".")
```

## 출력 옵션

| 옵션 | 설명 | 기본값 |
|--------|-------------|---------|
| `-o, --output <file>` | 출력 파일 이름 | `repomix-output.txt` |
| `--style <type>` | 출력 형식 (`plain`, `xml`, `markdown`) | `plain` |
| `--output-show-line-numbers` | 행 번호 추가 | `false` |
| `--copy` | 클립보드에 복사 | `false` |
| `--no-file-summary` | 파일 요약 비활성화 | `true` |
| `--no-directory-structure` | 디렉토리 구조 비활성화 | `true` |
| `--remove-comments` | 주석 제거 | `false` |
| `--remove-empty-lines` | 빈 줄 제거 | `false` |

## 필터 옵션

| 옵션 | 설명 |
|--------|-------------|
| `--include <patterns>` | 포함할 패턴 (쉼표로 구분) |
| `-i, --ignore <patterns>` | 제외할 패턴 (쉼표로 구분) |

## 원격 저장소

| 옵션 | 설명 |
|--------|-------------|
| `--remote <url>` | 원격 저장소 처리 |
| `--remote-branch <name>` | 브랜치/태그/커밋 지정 |

## 설정

| 옵션 | 설명 |
|--------|-------------|
| `-c, --config <path>` | 사용자 정의 설정 파일 경로 |
| `--init` | 설정 파일 생성 |
| `--global` | 전역 설정 사용 |

## 보안

| 옵션 | 설명 | 기본값 |
|--------|-------------|---------|
| `--no-security-check` | 보안 검사 비활성화 | `true` |

## 기타 옵션

| 옵션 | 설명 |
|--------|-------------|
| `-v, --version` | 버전 표시 |
| `--verbose` | 상세 로그 활성화 |
| `--top-files-len <number>` | 표시할 상위 파일 수 | `5` |

## 사용 예시

```bash
# 기본 사용법
repomix

# 사용자 정의 출력
repomix -o output.xml --style xml

# 특정 파일 처리
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# 원격 저장소 처리
repomix --remote user/repo --remote-branch main
```
