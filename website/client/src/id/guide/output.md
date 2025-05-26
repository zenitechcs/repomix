# Format Output

<script setup>
import HomeBadges from '../../../components/HomeBadges.vue'
</script>

<HomeBadges />

Repomix mendukung beberapa format output untuk memenuhi berbagai kebutuhan. Anda dapat memilih format yang paling sesuai dengan kasus penggunaan Anda.

## Format yang Tersedia

Repomix mendukung tiga format output utama:

1. **XML** (default): Format terstruktur yang ideal untuk pemrosesan AI
2. **Markdown**: Format yang mudah dibaca manusia dengan dukungan sintaks
3. **Teks Biasa**: Format sederhana tanpa markup

## Memilih Format

Anda dapat menentukan format output menggunakan flag `--style`:

```bash
# Format XML (default)
repomix --style xml

# Format Markdown
repomix --style markdown

# Format teks biasa
repomix --style plain
```

## Contoh Output

### Format XML

```xml
<repomix version="1.0.0" timestamp="2023-04-01T12:00:00Z" repo="example-repo">
  <stats>
    <files>10</files>
    <lines>500</lines>
    <tokens>5000</tokens>
  </stats>
  <file path="src/index.js" language="javascript" tokens="120">
    <content>
    // Kode sumber di sini
    </content>
  </file>
  <!-- File lainnya -->
</repomix>
```

### Format Markdown

```markdown
# Repomix Output: example-repo

Generated on: 2023-04-01T12:00:00Z

## Stats
- Files: 10
- Lines: 500
- Tokens: 5000

## Files

### src/index.js (JavaScript, 120 tokens)

```javascript
// Kode sumber di sini
```

<!-- File lainnya -->
```

### Format Teks Biasa

```
Repomix Output: example-repo
Generated on: 2023-04-01T12:00:00Z

Stats:
- Files: 10
- Lines: 500
- Tokens: 5000

Files:

src/index.js (JavaScript, 120 tokens)
------------------------------------
// Kode sumber di sini

// File lainnya
```

## Konfigurasi

Anda dapat menentukan format output dalam file konfigurasi Anda:

```json
{
  "output": {
    "style": "markdown",
    "filePath": "custom-output.md"
  }
}
```

## Opsi Terkait

Beberapa opsi terkait yang dapat memengaruhi output:

- `--output`, `-o`: Menentukan jalur file output
- `--no-line-numbers`: Menonaktifkan nomor baris
- `--remove-comments`: Menghapus komentar dari kode sumber
- `--top-files`: Menentukan jumlah file teratas yang akan ditampilkan di ringkasan
- `--copy-to-clipboard`: Menyalin output ke clipboard
