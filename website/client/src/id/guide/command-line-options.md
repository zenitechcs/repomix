# Opsi Baris Perintah

## Opsi Dasar
- `-v, --version`: Menampilkan versi tool

## Opsi Output
- `-o, --output <file>`: Nama file output (default: `repomix-output.txt`)
- `--stdout`: Output ke stdout daripada menulis ke file (tidak dapat digunakan dengan opsi `--output`)
- `--style <type>`: Gaya output (`plain`, `xml`, `markdown`) (default: `xml`)
- `--parsable-style`: Mengaktifkan output yang dapat diparsing berdasarkan skema gaya yang dipilih (default: `false`)
- `--compress`: Melakukan ekstraksi kode cerdas, berfokus pada signature fungsi dan class penting sambil menghapus detail implementasi. Untuk detail dan contoh lebih lanjut, lihat [Panduan Kompresi Kode](code-compress).
- `--output-show-line-numbers`: Menambahkan nomor baris (default: `false`)
- `--copy`: Salin ke clipboard (default: `false`)
- `--no-file-summary`: Menonaktifkan ringkasan file (default: `true`)
- `--no-directory-structure`: Menonaktifkan struktur direktori (default: `true`)
- `--no-files`: Menonaktifkan output konten file (mode metadata saja) (default: `true`)
- `--remove-comments`: Menghapus komentar (default: `false`)
- `--remove-empty-lines`: Menghapus baris kosong (default: `false`)
- `--truncate-base64`: Memotong string data yang dikodekan base64 (default: `false`)
- `--header-text <text>`: Teks kustom untuk disertakan dalam header file
- `--instruction-file-path <path>`: Jalur ke file yang berisi instruksi kustom rinci
- `--include-empty-directories`: Sertakan direktori kosong dalam output (default: `false`)
- `--include-diffs`: Sertakan diff git dalam output (termasuk perubahan work tree dan staged secara terpisah) (default: `false`)
- `--no-git-sort-by-changes`: Menonaktifkan pengurutan file berdasarkan jumlah perubahan git (default: `true`)

## Opsi Filter
- `--include <patterns>`: Pola untuk disertakan (dipisahkan koma)
- `-i, --ignore <patterns>`: Pola untuk diabaikan (dipisahkan koma)
- `--stdin`: Membaca jalur file dari stdin daripada menemukan file secara otomatis
- `--no-gitignore`: Menonaktifkan penggunaan file .gitignore
- `--no-default-patterns`: Menonaktifkan pola default

## Opsi Repositori Remote
- `--remote <url>`: Proses repositori remote
- `--remote-branch <name>`: Tentukan nama branch remote, tag, atau commit hash (default ke branch default repositori)

## Opsi Konfigurasi
- `-c, --config <path>`: Jalur file konfigurasi kustom
- `--init`: Buat file konfigurasi
- `--global`: Gunakan konfigurasi global

## Opsi Keamanan
- `--no-security-check`: Menonaktifkan pemeriksaan keamanan (default: `true`)

## Opsi Penghitungan Token
- `--token-count-encoding <encoding>`: Tentukan encoding penghitungan token (misal, `o200k_base`, `cl100k_base`) (default: `o200k_base`)

## Opsi Lainnya
- `--top-files-len <number>`: Jumlah file teratas yang ditampilkan (default: `5`)
- `--verbose`: Mengaktifkan logging verbose
- `--quiet`: Menonaktifkan semua output ke stdout

## Contoh

```bash
# Penggunaan dasar
repomix

# Output kustom
repomix -o output.xml --style xml

# Output ke stdout
repomix --stdout > custom-output.txt

# Kirim output ke stdout, lalu pipe ke perintah lain (misalnya, simonw/llm)
repomix --stdout | llm "Tolong jelaskan apa yang dilakukan kode ini."

# Output kustom dengan kompresi
repomix --compress

# Proses file tertentu
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# Repositori remote dengan branch
repomix --remote https://github.com/user/repo/tree/main

# Repositori remote dengan commit
repomix --remote https://github.com/user/repo/commit/836abcd7335137228ad77feb28655d85712680f1

# Repositori remote dengan format singkat
repomix --remote user/repo

# Menggunakan stdin untuk daftar file
find src -name "*.ts" -type f | repomix --stdin
git ls-files "*.js" | repomix --stdin
echo -e "src/index.ts\nsrc/utils.ts" | repomix --stdin
```