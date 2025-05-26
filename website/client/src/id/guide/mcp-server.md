# Server MCP


Server MCP (Model Code Provider) adalah fitur Repomix yang menyediakan antarmuka HTTP untuk mengakses dan memproses basis kode Anda. Ini memungkinkan alat dan layanan lain untuk berinteraksi dengan Repomix melalui API.

## Memulai Server

Untuk memulai server MCP, gunakan flag `--mcp`:

```bash
repomix --mcp
```

Secara default, server akan berjalan di port 3000. Anda dapat menentukan port yang berbeda menggunakan flag `--mcp-port`:

```bash
repomix --mcp --mcp-port 8080
```

## Endpoint API

Server MCP menyediakan beberapa endpoint API:

### GET /

Mengembalikan informasi dasar tentang server MCP.

**Contoh Respons:**

```json
{
  "name": "Repomix MCP Server",
  "version": "1.0.0",
  "status": "running"
}
```

### GET /files

Mengembalikan daftar semua file dalam repositori.

**Contoh Respons:**

```json
{
  "files": [
    {
      "path": "src/index.js",
      "language": "javascript",
      "tokens": 120
    },
    {
      "path": "src/utils.js",
      "language": "javascript",
      "tokens": 85
    }
  ]
}
```

### GET /file/:path

Mengembalikan konten file tertentu.

**Parameter:**
- `path`: Jalur file (URL-encoded)

**Contoh Permintaan:**
```
GET /file/src%2Findex.js
```

**Contoh Respons:**

```json
{
  "path": "src/index.js",
  "language": "javascript",
  "tokens": 120,
  "content": "// Kode sumber di sini"
}
```

### GET /repomix

Mengembalikan seluruh output Repomix dalam format yang ditentukan.

**Parameter Query:**
- `style`: Format output (`xml`, `markdown`, `plain`). Default: `xml`
- `removeComments`: Menghapus komentar (`true`, `false`). Default: `false`
- `showLineNumbers`: Menampilkan nomor baris (`true`, `false`). Default: `true`

**Contoh Permintaan:**
```
GET /repomix?style=markdown&removeComments=true
```

**Contoh Respons:**

```json
{
  "content": "# Repomix Output\n\n## Files\n\n### src/index.js\n\n```javascript\n// Kode sumber di sini\n```"
}
```

## Integrasi dengan Alat Lain

Server MCP dapat diintegrasikan dengan berbagai alat dan layanan:

### Integrasi IDE

Anda dapat membuat ekstensi IDE yang berkomunikasi dengan server MCP untuk menyediakan wawasan AI tentang kode Anda langsung di IDE.

### Integrasi CI/CD

Integrasikan server MCP ke dalam pipeline CI/CD Anda untuk menghasilkan dokumentasi atau analisis kode otomatis.

### Aplikasi Web Kustom

Buat aplikasi web kustom yang menggunakan API server MCP untuk menyediakan antarmuka yang ramah pengguna untuk berinteraksi dengan basis kode Anda.

## Keamanan

Secara default, server MCP hanya mendengarkan pada localhost (`127.0.0.1`), yang berarti hanya dapat diakses dari mesin yang sama. Jika Anda perlu mengaksesnya dari mesin lain, Anda dapat menggunakan flag `--mcp-host`:

```bash
repomix --mcp --mcp-host 0.0.0.0
```

> [!WARNING]
> Mengatur host ke `0.0.0.0` akan membuat server dapat diakses dari jaringan. Pastikan untuk mengamankan akses dengan benar, terutama jika server menangani kode sumber sensitif.

## Konfigurasi

Anda dapat mengonfigurasi server MCP dalam file konfigurasi Anda:

```json
{
  "mcp": {
    "enabled": true,
    "port": 8080,
    "host": "127.0.0.1"
  }
}
```

## Kasus Penggunaan

Server MCP sangat berguna untuk:

- Menyediakan akses ke basis kode untuk alat AI eksternal
- Membangun antarmuka kustom untuk berinteraksi dengan basis kode Anda
- Mengintegrasikan Repomix ke dalam alur kerja dan alat yang ada
- Menyediakan layanan analisis kode untuk tim pengembangan
