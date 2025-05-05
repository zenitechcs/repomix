# Using Repomix with GitHub Actions

You can automate the process of packing your codebase for AI analysis by integrating Repomix into your GitHub Actions workflows. This is useful for continuous integration (CI), code review, or preparing your repository for LLM-based tools.

## Basic Usage

Add the following step to your workflow YAML to pack your repository:

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    include: "**/*.ts"
    output: repomix-output.txt
```

## Packing Multiple Directories with Compression

You can specify multiple directories, include/exclude patterns, and enable smart compression:

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

## Uploading the Output as an Artifact

To make the packed file available for later workflow steps or for download, upload it as an artifact:

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

## Action Inputs

| Name              | Description                                 | Default           |
|-------------------|---------------------------------------------|-------------------|
| `directories`     | Space-separated list of directories to pack | `.`               |
| `include`         | Comma-separated glob patterns to include    | `""`             |
| `ignore`          | Comma-separated glob patterns to ignore     | `""`             |
| `output`          | Output file path                            | `repomix.txt`     |
| `compress`        | Enable smart compression                    | `true`            |
| `additional-args` | Extra CLI arguments for repomix             | `""`             |
| `repomix-version` | Version of the npm package to install       | `latest`          |

## Action Outputs

| Name          | Description                        |
|---------------|------------------------------------|
| `output_file` | Path to the generated output file   |

## Example: Full Workflow

Here is a complete example of a GitHub Actions workflow using Repomix:

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
