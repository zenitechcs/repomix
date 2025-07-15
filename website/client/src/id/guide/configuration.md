# Konfigurasi


Repomix dapat dikonfigurasi menggunakan file konfigurasi atau opsi baris perintah. File konfigurasi memberikan cara yang lebih terstruktur untuk menyimpan pengaturan Anda.

## File Konfigurasi

Repomix mencari file konfigurasi bernama `repomix.config.json` di direktori saat ini. Anda dapat membuat file konfigurasi baru dengan perintah:

```bash
repomix --init
```

Ini akan membuat file `repomix.config.json` dengan pengaturan default.

## Struktur Konfigurasi

Berikut adalah contoh file konfigurasi dengan semua opsi yang tersedia:

```json
{
  "output": {
    "style": "xml",
    "filePath": "repomix-output.xml",
    "removeComments": false,
    "showLineNumbers": true,
    "truncateBase64": false,
    "topFilesLength": 10,
    "copyToClipboard": false
  },
  "ignore": {
    "customPatterns": [],
    "respectGitignore": true
  },
  "security": {
    "enabled": true,
    "rules": []
  },
  "diffs": {
    "enabled": false,
    "baseBranch": "main"
  }
}
```

## Opsi Konfigurasi

### Output

| Opsi | Tipe | Default | Deskripsi |
|------|------|---------|-----------|
| `style` | string | `"xml"` | Format output. Nilai yang mungkin: `"xml"`, `"markdown"`, `"plain"` |
| `filePath` | string | `"repomix-output.xml"` | Jalur file output |
| `removeComments` | boolean | `false` | Apakah akan menghapus komentar dari kode sumber |
| `showLineNumbers` | boolean | `true` | Apakah akan menampilkan nomor baris |
| `truncateBase64` | boolean | `false` | Apakah akan memotong string data base64 yang panjang (misalnya, gambar) untuk mengurangi jumlah token |
| `topFilesLength` | number | `10` | Jumlah file teratas yang akan ditampilkan di ringkasan |
| `copyToClipboard` | boolean | `false` | Apakah akan menyalin output ke clipboard |

### Ignore

| Opsi | Tipe | Default | Deskripsi |
|------|------|---------|-----------|
| `customPatterns` | string[] | `[]` | Pola glob kustom untuk mengabaikan file |
| `respectGitignore` | boolean | `true` | Apakah akan menghormati file `.gitignore` |

### Security

| Opsi | Tipe | Default | Deskripsi |
|------|------|---------|-----------|
| `enabled` | boolean | `true` | Apakah akan mengaktifkan pemeriksaan keamanan |
| `rules` | string[] | `[]` | Aturan keamanan kustom |

### Diffs

| Opsi | Tipe | Default | Deskripsi |
|------|------|---------|-----------|
| `enabled` | boolean | `false` | Apakah akan mengaktifkan mode diff |
| `baseBranch` | string | `"main"` | Cabang dasar untuk perbandingan diff |

## Mengganti Konfigurasi dengan Opsi Baris Perintah

Semua pengaturan dalam file konfigurasi dapat diganti dengan opsi baris perintah. Misalnya:

```bash
repomix --style markdown --output custom-output.md --remove-comments
```

Untuk daftar lengkap opsi baris perintah, lihat [Opsi Baris Perintah](command-line-options.md).

## Prioritas Konfigurasi

Repomix menggunakan prioritas berikut untuk konfigurasi:

1. Opsi baris perintah
2. File konfigurasi proyek (`repomix.config.json`)
3. Nilai default

## Konfigurasi Global

Repomix juga mendukung konfigurasi global yang berlaku untuk semua proyek. File konfigurasi global terletak di:

- Windows: `%USERPROFILE%\.repomix\config.json`
- macOS/Linux: `~/.repomix/config.json`

Konfigurasi global memiliki prioritas lebih rendah daripada konfigurasi proyek dan opsi baris perintah.
