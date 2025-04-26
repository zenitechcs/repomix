# Usando o Repomix com GitHub Actions

Você pode automatizar o empacotamento do seu código para análise por IA integrando o Repomix aos seus workflows do GitHub Actions. Isso é útil para integração contínua (CI), revisão de código ou preparação para ferramentas LLM.

## Uso básico

Adicione o seguinte passo ao seu arquivo YAML de workflow para empacotar seu repositório:

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    include: "**/*.ts"
    output: repomix-output.txt
```

## Empacotando múltiplos diretórios com compressão

Você pode especificar múltiplos diretórios, padrões de inclusão/exclusão e ativar a compressão inteligente:

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src tests
    include: "**/*.ts,**/*.md"
    ignore: "**/*.test.ts"
    output: repomix-output.txt
    compress: true
```

## Enviando o arquivo de saída como artefato

Para disponibilizar o arquivo empacotado para etapas posteriores ou para download, envie-o como artefato:

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    output: repomix-output.txt
    compress: true

- name: Upload Repomix output
  uses: actions/upload-artifact@v4
  with:
    name: repomix-output
    path: repomix-output.txt
```

## Parâmetros de entrada da Action

| Nome               | Descrição                                   | Padrão            |
|--------------------|---------------------------------------------|-------------------|
| `directories`      | Lista de diretórios a empacotar (separados por espaço) | `.`         |
| `include`          | Padrões glob a incluir (separados por vírgula) | `""`         |
| `ignore`           | Padrões glob a ignorar (separados por vírgula) | `""`         |
| `output`           | Caminho do arquivo de saída                  | `repomix.txt`     |
| `compress`         | Ativar compressão inteligente                | `true`            |
| `additional-args`  | Argumentos extras para o repomix CLI         | `""`         |
| `repomix-version`  | Versão do pacote npm a instalar              | `latest`          |

## Saídas da Action

| Nome          | Descrição                        |
|---------------|----------------------------------|
| `output-file` | Caminho do arquivo gerado         |

## Exemplo de workflow completo

Aqui está um exemplo completo de workflow do GitHub Actions usando o Repomix:

```yaml
name: Pack and Upload Codebase
on:
  push:
    branches: [main]

jobs:
  pack:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Pack repository with Repomix
        uses: yamadashy/repomix/.github/actions/repomix@main
        with:
          directories: src
          include: "**/*.ts"
          output: repomix-output.txt
          compress: true
      - name: Upload Repomix output
        uses: actions/upload-artifact@v4
        with:
          name: repomix-output
          path: repomix-output.txt
``` 
