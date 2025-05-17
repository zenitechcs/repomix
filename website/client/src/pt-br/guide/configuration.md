# Configuração

## Início rápido

Criar arquivo de configuração:
```bash
repomix --init
```

## Opções de configuração

| Opção                            | Descrição                                                                                                                     | Valor padrão           |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `input.maxFileSize`              | Tamanho máximo do arquivo em bytes para processar. Arquivos maiores serão ignorados                                          | `50000000`            |
| `output.filePath`                | Nome do arquivo de saída                                                                                                      | `"repomix-output.xml"` |
| `output.style`                   | Estilo de saída (`xml`, `markdown`, `plain`)                                                                                  | `"xml"`                |
| `output.parsableStyle`           | Se a saída deve ser escapada de acordo com o esquema de estilo escolhido. Note que isso pode aumentar a contagem de tokens   | `false`                |
| `output.compress`                | Se deve realizar extração inteligente de código para reduzir a contagem de tokens                                             | `false`                |
| `output.headerText`              | Texto personalizado para incluir no cabeçalho do arquivo                                                                      | `null`                 |
| `output.instructionFilePath`     | Caminho para um arquivo contendo instruções personalizadas detalhadas                                                         | `null`                 |
| `output.fileSummary`             | Se deve incluir uma seção de resumo no início da saída                                                                       | `true`                 |
| `output.directoryStructure`      | Se deve incluir a estrutura de diretórios na saída                                                                           | `true`                 |
| `output.files`                   | Se deve incluir o conteúdo dos arquivos na saída                                                                             | `true`                 |
| `output.removeComments`          | Se deve remover comentários dos tipos de arquivo suportados                                                                   | `false`                |
| `output.removeEmptyLines`        | Se deve remover linhas vazias da saída                                                                                       | `false`                |
| `output.showLineNumbers`         | Se deve adicionar números de linha a cada linha                                                                               | `false`                |
| `output.copyToClipboard`         | Se a saída deve ser copiada para a área de transferência do sistema além de ser salva                                        | `false`                |
| `output.topFilesLength`          | Número de arquivos principais a serem exibidos no resumo. Se definido como 0, nenhum resumo será exibido                     | `5`                    |
| `output.includeEmptyDirectories` | Se deve incluir diretórios vazios na estrutura do repositório                                                                | `false`                |
| `output.git.sortByChanges`       | Se os arquivos devem ser ordenados por número de alterações Git (arquivos com mais alterações aparecem no final)             | `true`                 |
| `output.git.sortByChangesMaxCommits` | Número máximo de commits a analisar para alterações Git                                                                   | `100`                  |
| `output.git.includeDiffs`        | Se deve incluir diferenças Git na saída (inclui separadamente as alterações da árvore de trabalho e da área de preparação)   | `false`                |
| `include`                        | Padrões de arquivos a incluir (usa [padrões glob](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax))    | `[]`                   |
| `ignore.useGitignore`            | Se deve usar os padrões do arquivo `.gitignore` do projeto                                                                    | `true`                 |
| `ignore.useDefaultPatterns`      | Se deve usar os padrões de ignorar padrão                                                                                    | `true`                 |
| `ignore.customPatterns`          | Padrões adicionais para ignorar (usa [padrões glob](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)) | `[]`                   |
| `security.enableSecurityCheck`   | Se deve realizar verificações de segurança nos arquivos                                                                       | `true`                 |
| `tokenCount.encoding`            | Codificação de contagem de tokens usada pelo tokenizador [tiktoken](https://github.com/openai/tiktoken) da OpenAI (por exemplo, `o200k_base` para GPT-4o, `cl100k_base` para GPT-4/3.5). Veja [tiktoken model.py](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py#L24) para detalhes. | `"o200k_base"`         |

O arquivo de configuração suporta a sintaxe [JSON5](https://json5.org/), que permite:
- Comentários (de uma linha e multilinha)
- Vírgulas finais em objetos e arrays
- Nomes de propriedades sem aspas
- Sintaxe de string mais flexível

## Exemplo de arquivo de configuração

Aqui está um exemplo de um arquivo de configuração completo (`repomix.config.json`):

```json
{
  "input": {
    "maxFileSize": 50000000
  },
  "output": {
    "filePath": "repomix-output.xml",
    "style": "xml",
    "parsableStyle": false,
    "compress": false,
    "headerText": "Informações de cabeçalho personalizadas para o arquivo empacotado",
    "fileSummary": true,
    "directoryStructure": true,
    "files": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "includeEmptyDirectories": false,
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": false
    }
  },
  "include": ["**/*"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    // Os padrões também podem ser especificados em .repomixignore
    "customPatterns": [
      "additional-folder",
      "**/*.log"
    ],
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
```

## Configuração global

Criar configuração global:
```bash
repomix --init --global
```

Localização:
- Windows: `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux: `~/.config/repomix/repomix.config.json`

## Padrões de ignorar

Prioridade:
1. Opções CLI (`--ignore`)
2. `.repomixignore`
3. `.gitignore` e `.git/info/exclude`
4. Padrões padrão

Exemplo de `.repomixignore`:
```text
# Diretórios de cache
.cache/
tmp/

# Saídas de compilação
dist/
build/

# Logs
*.log
```

## Padrões de ignorar padrão

Padrões comuns incluídos por padrão:
```text
node_modules/**
.git/**
coverage/**
dist/**
```

Lista completa: [defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)

## Exemplos

### Compressão de código

Quando `output.compress` é definido como `true`, o Repomix extrai as estruturas de código essenciais enquanto remove os detalhes de implementação. Isso ajuda a reduzir a contagem de tokens enquanto mantém informações estruturais importantes.

Para mais detalhes e exemplos, consulte o [Guia de compressão de código](code-compress).

### Integração Git

A configuração `output.git` permite que você controle como os arquivos são ordenados com base no histórico Git e como incluir diferenças Git:

- `sortByChanges`: Quando definido como `true`, os arquivos são ordenados por número de alterações Git (commits que modificaram o arquivo). Arquivos com mais alterações aparecem no final da saída. Isso ajuda a priorizar os arquivos mais ativamente desenvolvidos. Valor padrão: `true`
- `sortByChangesMaxCommits`: Número máximo de commits a analisar ao contar alterações de arquivos. Valor padrão: `100`
- `includeDiffs`: Quando definido como `true`, inclui diferenças Git na saída (inclui separadamente as alterações da árvore de trabalho e da área de preparação). Isso permite que o leitor veja as alterações pendentes no repositório. Valor padrão: `false`

Exemplo de configuração:
```json
{
  "output": {
    "git": {
      "sortByChanges": true,
      "sortByChangesMaxCommits": 100,
      "includeDiffs": true
    }
  }
}
```

### Remoção de comentários

Quando `output.removeComments` é definido como `true`, os comentários são removidos dos tipos de arquivo suportados para reduzir o tamanho da saída e focar no conteúdo essencial do código.

Para os idiomas suportados e exemplos detalhados, consulte o [Guia de remoção de comentários](comment-removal).
