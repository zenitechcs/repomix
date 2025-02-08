# Opções de linha de comando

## Opções básicas
- `-v, --version`: Mostrar versão

## Opções de saída
- `-o, --output <file>`: Nome do arquivo de saída (valor padrão: `repomix-output.txt`)
- `--style <type>`: Formato de saída (`plain`, `xml`, `markdown`) (valor padrão: `plain`)
- `--parsable-style`: Habilitar saída analisável baseada no esquema de estilo selecionado (valor padrão: `false`)
- `--output-show-line-numbers`: Adicionar números de linha (valor padrão: `false`)
- `--copy`: Copiar para a área de transferência (valor padrão: `false`)
- `--no-file-summary`: Desabilitar resumo de arquivos (valor padrão: `true`)
- `--no-directory-structure`: Desabilitar estrutura de diretórios (valor padrão: `true`)
- `--remove-comments`: Remover comentários (valor padrão: `false`)
- `--remove-empty-lines`: Remover linhas vazias (valor padrão: `false`)
- `--header-text <text>`: Texto personalizado para incluir no cabeçalho do arquivo
- `--instruction-file-path <path>`: Caminho para arquivo com instruções personalizadas detalhadas
- `--include-empty-directories`: Incluir diretórios vazios na saída (valor padrão: `false`)

## Opções de filtro
- `--include <patterns>`: Padrões de inclusão (separados por vírgula)
- `-i, --ignore <patterns>`: Padrões de exclusão (separados por vírgula)
- `--no-gitignore`: Desabilitar uso do arquivo .gitignore
- `--no-default-patterns`: Desabilitar padrões padrão

## Opções de repositório remoto
- `--remote <url>`: Processar repositório remoto
- `--remote-branch <name>`: Especificar nome do branch remoto, tag ou hash do commit (valor padrão é o branch padrão do repositório)

## Opções de configuração
- `-c, --config <path>`: Caminho do arquivo de configuração personalizado
- `--init`: Criar arquivo de configuração
- `--global`: Usar configuração global

## Opções de segurança
- `--no-security-check`: Desabilitar verificação de segurança (valor padrão: `true`)

## Opções de contagem de tokens
- `--token-count-encoding <encoding>`: Especificar codificação para contagem de tokens (ex: `o200k_base`, `cl100k_base`) (valor padrão: `o200k_base`)

## Outras opções
- `--top-files-len <number>`: Número de arquivos principais a mostrar (valor padrão: `5`)
- `--verbose`: Habilitar log detalhado

## Exemplos de uso

```bash
# Uso básico
repomix

# Saída personalizada
repomix -o output.xml --style xml

# Processar arquivos específicos
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# Repositório remoto com branch específico
repomix --remote https://github.com/user/repo/tree/main

# Repositório remoto com commit específico
repomix --remote https://github.com/user/repo/commit/836abcd7335137228ad77feb28655d85712680f1

# Formato abreviado de repositório remoto
repomix --remote user/repo
