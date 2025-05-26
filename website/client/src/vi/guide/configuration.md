# Cấu hình

Repomix có thể được cấu hình thông qua tệp cấu hình JSON, cho phép bạn lưu trữ các tùy chọn và chia sẻ cấu hình giữa các dự án.

## Tạo tệp cấu hình

Để tạo một tệp cấu hình mẫu, hãy chạy:

```bash
repomix --init
```

Lệnh này sẽ tạo một tệp `repomix.config.json` trong thư mục hiện tại với các cài đặt mặc định.

## Vị trí tệp cấu hình

Repomix tìm kiếm tệp cấu hình theo thứ tự sau:

1. Đường dẫn được chỉ định bởi tùy chọn `--config`
2. `repomix.config.json` trong thư mục hiện tại
3. `.repomixrc` trong thư mục hiện tại
4. `.repomixrc.json` trong thư mục hiện tại
5. `.repomixrc.js` trong thư mục hiện tại (phải xuất một đối tượng)

## Cấu trúc cấu hình

Tệp cấu hình có cấu trúc sau:

```json
{
  "output": {
    "style": "xml",
    "filePath": "repomix-output.xml",
    "removeComments": false,
    "showLineNumbers": false,
    "topFilesLength": 10
  },
  "ignore": {
    "respectGitignore": true,
    "customPatterns": []
  },
  "security": {
    "check": true,
    "secretlintConfigPath": null
  },
  "advanced": {
    "compressCode": false,
    "tokenCount": true
  }
}
```

## Tùy chọn cấu hình

### Cấu hình đầu ra

| Tùy chọn | Mô tả | Giá trị mặc định |
| --- | --- | --- |
| `output.style` | Định dạng đầu ra | `"xml"` |
| `output.filePath` | Đường dẫn tệp đầu ra | `"repomix-output.xml"` |
| `output.removeComments` | Xóa bình luận khỏi mã nguồn | `false` |
| `output.showLineNumbers` | Hiển thị số dòng trong đầu ra | `false` |
| `output.topFilesLength` | Số lượng tệp hàng đầu để hiển thị trong tóm tắt | `10` |

### Cấu hình bỏ qua

| Tùy chọn | Mô tả | Giá trị mặc định |
| --- | --- | --- |
| `ignore.respectGitignore` | Tôn trọng các tệp .gitignore | `true` |
| `ignore.customPatterns` | Mảng các mẫu glob để bỏ qua | `[]` |

### Cấu hình bảo mật

| Tùy chọn | Mô tả | Giá trị mặc định |
| --- | --- | --- |
| `security.check` | Bật kiểm tra bảo mật | `true` |
| `security.secretlintConfigPath` | Đường dẫn đến tệp cấu hình Secretlint | `null` |

### Cấu hình nâng cao

| Tùy chọn | Mô tả | Giá trị mặc định |
| --- | --- | --- |
| `advanced.compressCode` | Nén mã bằng cách chỉ bao gồm chữ ký hàm | `false` |
| `advanced.tokenCount` | Bật đếm token | `true` |

## Ví dụ cấu hình

### Cấu hình cơ bản

```json
{
  "output": {
    "style": "markdown",
    "filePath": "codebase.md"
  }
}
```

### Cấu hình với mẫu bỏ qua tùy chỉnh

```json
{
  "output": {
    "style": "xml",
    "filePath": "repomix-output.xml"
  },
  "ignore": {
    "respectGitignore": true,
    "customPatterns": ["*.test.ts", "docs/**", "**/*.log"]
  }
}
```

### Cấu hình đầy đủ

```json
{
  "output": {
    "style": "markdown",
    "filePath": "codebase.md",
    "removeComments": true,
    "showLineNumbers": true,
    "topFilesLength": 20
  },
  "ignore": {
    "respectGitignore": true,
    "customPatterns": ["*.test.ts", "docs/**"]
  },
  "security": {
    "check": true,
    "secretlintConfigPath": "./secretlint.config.js"
  },
  "advanced": {
    "compressCode": true,
    "tokenCount": true
  }
}
```

## Ghi đè cấu hình

Các tùy chọn dòng lệnh sẽ ghi đè các cài đặt trong tệp cấu hình. Ví dụ, nếu tệp cấu hình của bạn chỉ định `"style": "xml"` nhưng bạn chạy `repomix --style markdown`, đầu ra sẽ ở định dạng Markdown.

## Sử dụng .repomixignore

Ngoài việc chỉ định các mẫu bỏ qua trong tệp cấu hình, bạn cũng có thể tạo một tệp `.repomixignore` trong thư mục gốc của dự án. Tệp này sử dụng cú pháp tương tự như `.gitignore` và sẽ được sử dụng cùng với bất kỳ mẫu bỏ qua nào được chỉ định trong tệp cấu hình.

## Tiếp theo là gì?

- [Tùy chọn dòng lệnh](command-line-options.md): Xem tất cả các tùy chọn dòng lệnh có sẵn
- [Hướng dẫn tùy chỉnh](custom-instructions.md): Tìm hiểu về hướng dẫn tùy chỉnh
- [Bảo mật](security.md): Tìm hiểu về tính năng bảo mật của Repomix
