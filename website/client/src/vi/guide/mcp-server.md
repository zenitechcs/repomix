# Máy chủ MCP

Repomix bao gồm một máy chủ MCP (Model Code Processor) tích hợp, cho phép bạn chạy một máy chủ cục bộ để xử lý các yêu cầu đóng gói mã từ các công cụ khác.

## Tổng quan

Máy chủ MCP là một máy chủ HTTP nhẹ cung cấp API để đóng gói kho lưu trữ mã nguồn. Nó cho phép các ứng dụng khác (như tiện ích mở rộng trình duyệt Repomix) gửi yêu cầu để xử lý kho lưu trữ cục bộ hoặc từ xa.

Máy chủ MCP đặc biệt hữu ích cho:

- Tích hợp với tiện ích mở rộng trình duyệt Repomix
- Tạo API đóng gói mã cho các công cụ khác
- Xử lý các yêu cầu đóng gói từ các ứng dụng khác

## Khởi động máy chủ MCP

Để khởi động máy chủ MCP, sử dụng lệnh sau:

```bash
repomix serve
```

Theo mặc định, máy chủ sẽ lắng nghe trên cổng 3000. Bạn có thể chỉ định một cổng khác bằng cách sử dụng tùy chọn `--port`:

```bash
repomix serve --port 8080
```

## Tùy chọn máy chủ

| Tùy chọn | Mô tả | Mặc định |
| --- | --- | --- |
| `--port` | Cổng để lắng nghe | 3000 |
| `--host` | Máy chủ để lắng nghe | localhost |
| `--cors-origin` | Nguồn gốc CORS được phép | * |

Ví dụ:

```bash
repomix serve --port 8080 --host 0.0.0.0 --cors-origin https://example.com
```

## API máy chủ MCP

Máy chủ MCP cung cấp các điểm cuối API sau:

### Trạng thái máy chủ

```
GET /status
```

Trả về trạng thái máy chủ và thông tin phiên bản.

Ví dụ phản hồi:

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

### Xử lý kho lưu trữ cục bộ

```
POST /process/local
```

Xử lý một kho lưu trữ cục bộ và trả về đầu ra đã đóng gói.

Tham số yêu cầu:

```json
{
  "path": "/path/to/repository",
  "options": {
    "style": "xml",
    "removeComments": false,
    "showLineNumbers": false
  }
}
```

### Xử lý kho lưu trữ từ xa

```
POST /process/remote
```

Xử lý một kho lưu trữ từ xa và trả về đầu ra đã đóng gói.

Tham số yêu cầu:

```json
{
  "url": "https://github.com/owner/repo",
  "options": {
    "style": "markdown",
    "removeComments": true,
    "showLineNumbers": true
  }
}
```

## Sử dụng với tiện ích mở rộng trình duyệt

Máy chủ MCP được thiết kế để hoạt động với [tiện ích mở rộng trình duyệt Repomix](https://chromewebstore.google.com/detail/repomix/fimfamikepjgchehkohedilpdigcpkoa). Khi tiện ích mở rộng được cài đặt và máy chủ MCP đang chạy, bạn có thể dễ dàng đóng gói các kho lưu trữ GitHub trực tiếp từ trình duyệt của mình.

Quy trình làm việc điển hình:

1. Khởi động máy chủ MCP: `repomix serve`
2. Truy cập một kho lưu trữ GitHub trong trình duyệt của bạn
3. Nhấp vào biểu tượng tiện ích mở rộng Repomix
4. Chọn tùy chọn đóng gói của bạn
5. Nhấp vào "Đóng gói kho lưu trữ"

Tiện ích mở rộng sẽ gửi yêu cầu đến máy chủ MCP cục bộ của bạn, xử lý kho lưu trữ và trả về đầu ra đã đóng gói.

## Tích hợp với các công cụ khác

Bạn có thể tích hợp máy chủ MCP với các công cụ khác bằng cách gửi yêu cầu HTTP đến các điểm cuối API của nó.

Ví dụ sử dụng curl:

```bash
curl -X POST http://localhost:3000/process/remote \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com/yamadashy/repomix","options":{"style":"markdown"}}'
```

Ví dụ sử dụng JavaScript:

```javascript
async function processRepository() {
  const response = await fetch('http://localhost:3000/process/remote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: 'https://github.com/yamadashy/repomix',
      options: {
        style: 'markdown',
        removeComments: true,
      },
    }),
  });

  const data = await response.json();
  console.log(data.output);
}
```

## Lưu ý bảo mật

Khi chạy máy chủ MCP, hãy lưu ý những điểm sau:

- Máy chủ có quyền truy cập vào hệ thống tệp cục bộ của bạn
- Theo mặc định, máy chủ chỉ lắng nghe trên localhost
- Nếu bạn thay đổi máy chủ thành `0.0.0.0`, nó sẽ có thể truy cập được từ các máy khác
- Xem xét cấu hình `--cors-origin` để giới hạn các nguồn gốc có thể gửi yêu cầu

## Tiếp theo là gì?

- [GitHub Actions](github-actions.md): Tìm hiểu về tích hợp GitHub Actions
- [Tùy chọn dòng lệnh](command-line-options.md): Xem tất cả các tùy chọn dòng lệnh có sẵn
- [Cấu hình](configuration.md): Tìm hiểu về tệp cấu hình
