# Formatos de Saída

O Repomix suporta três formatos de saída:
- XML (padrão)
- Markdown
- Texto simples 

## Formato XML

```bash
repomix --style xml
```

O formato XML é otimizado para processamento por IA:

```xml
Este arquivo é uma representação consolidada de toda a base de código...

<file_summary>
(Metadados e instruções para IA)
</file_summary>

<directory_structure>
src/
  index.ts
  utils/
    helper.ts
</directory_structure>

<files>
<file path="src/index.ts">
// Conteúdo do arquivo aqui
</file>
</files>

<git_logs>
<git_log_commit>
<date>2025-08-20 00:47:19 +0900</date>
<message>feat(cli): Add --include-logs option for git commit history</message>
<files>
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts
</files>
</git_log_commit>

<git_log_commit>
<date>2025-08-21 00:09:43 +0900</date>
<message>Merge pull request #795 from yamadashy/chore/ratchet-update-ci</message>
<files>
.github/workflows/ratchet-update.yml
</files>
</git_log_commit>
</git_logs>
```

::: tip Por que XML?
As tags XML ajudam modelos de IA como o Claude a analisar o conteúdo com mais precisão. A [documentação do Claude](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags) recomenda o uso de tags XML para prompts estruturados.
:::

## Formato Markdown

```bash
repomix --style markdown
```

O Markdown oferece formatação legível:

```markdown
Este arquivo é uma representação consolidada de toda a base de código...

# Resumo do Arquivo
(Metadados e instruções para IA)

# Estrutura de Diretórios
```
src/
index.ts
utils/
helper.ts
```

# Arquivos

## Arquivo: src/index.ts
```typescript
// Conteúdo do arquivo aqui
```

# Logs do Git
```
2025-08-20 00:47:19 +0900|feat(cli): Add --include-logs option for git commit history
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts

2025-08-21 00:09:43 +0900|Merge pull request #795 from yamadashy/chore/ratchet-update-ci
.github/workflows/ratchet-update.yml
```
```

## Uso com Modelos de IA

Cada formato funciona bem com modelos de IA, mas considere:
- Use XML para Claude (melhor precisão de análise)
- Use Markdown para leitura geral
- Use Texto Simples para simplicidade e compatibilidade universal

## Customização

Defina o formato padrão no `repomix.config.json`:
```json
{
  "output": {
    "style": "xml",
    "filePath": "output.xml"
  }
}
```

## Formato de Texto Simples

```bash
repomix --style plain
```

Estrutura de saída:
```text
Este arquivo é uma representação consolidada de toda a base de código...

================
Resumo do Arquivo
================
(Metadados e instruções para IA)

================
Estrutura de Diretórios
================
src/
  index.ts
  utils/
    helper.ts

================
Arquivos
================

================
Arquivo: src/index.ts
================
// Conteúdo do arquivo aqui

================
Logs do Git
================
2025-08-20 00:47:19 +0900|feat(cli): Add --include-logs option for git commit history
README.md
src/cli/cliRun.ts
src/core/git/gitCommand.ts
src/core/git/gitLogHandle.ts
src/core/output/outputGenerate.ts

2025-08-21 00:09:43 +0900|Merge pull request #795 from yamadashy/chore/ratchet-update-ci
.github/workflows/ratchet-update.yml
```
