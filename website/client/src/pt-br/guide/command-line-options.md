# Opções de Linha de Comando

## Opções Básicas

```bash
repomix [diretório]  # Processar diretório específico (padrão: ".")
```

## Opções de Saída

| Opção | Descrição | Padrão |
|--------|-------------|---------|
| `-o, --output <arquivo>` | Nome do arquivo de saída | `repomix-output.txt` |
| `--style <tipo>` | Estilo de saída (`plain`, `xml`, `markdown`) | `plain` |
| `--output-show-line-numbers` | Adicionar números de linha | `false` |
| `--copy` | Copiar para a área de transferência | `false` |
| `--no-file-summary` | Desabilitar resumo de arquivos | `true` |
| `--no-directory-structure` | Desabilitar estrutura de diretórios | `true` |
| `--remove-comments` | Remover comentários | `false` |
| `--remove-empty-lines` | Remover linhas vazias | `false` |

## Opções de Filtro

| Opção | Descrição |
|--------|-------------|
| `--include <padrões>` | Padrões de inclusão (separados por vírgula) |
| `-i, --ignore <padrões>` | Padrões de exclusão (separados por vírgula) |

## Repositório Remoto

| Opção | Descrição |
|--------|-------------|
| `--remote <url>` | Processar repositório remoto |
| `--remote-branch <nome>` | Especificar branch/tag/commit |

## Configuração

| Opção | Descrição |
|--------|-------------|
| `-c, --config <caminho>` | Caminho do arquivo de configuração personalizado |
| `--init` | Criar arquivo de configuração |
| `--global` | Usar configuração global |

## Segurança

| Opção | Descrição | Padrão |
|--------|-------------|---------|
| `--no-security-check` | Desabilitar verificação de segurança | `true` |

## Outras Opções

| Opção | Descrição |
|--------|-------------|
| `-v, --version` | Mostrar versão |
| `--verbose` | Habilitar logging detalhado |
| `--top-files-len <número>` | Número de arquivos principais para mostrar | `5` |

## Exemplos

```bash
# Uso básico
repomix

# Saída personalizada
repomix -o output.xml --style xml

# Processar arquivos específicos
repomix --include "src/**/*.ts" --ignore "**/*.test.ts"

# Repositório remoto
repomix --remote user/repo --remote-branch main
