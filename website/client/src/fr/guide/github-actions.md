# Utiliser Repomix avec GitHub Actions

Vous pouvez automatiser le packaging de votre codebase pour l'analyse par IA en intégrant Repomix dans vos workflows GitHub Actions. Ceci est utile pour l'intégration continue (CI), la revue de code ou la préparation pour des outils LLM.

## Utilisation de base

Ajoutez l'étape suivante à votre fichier YAML de workflow pour packager votre dépôt :

```yaml
- name: Pack repository with Repomix
  uses: yamadashy/repomix/.github/actions/repomix@main
  with:
    directories: src
    include: "**/*.ts"
    output: repomix-output.txt
```

## Packager plusieurs dossiers avec compression

Vous pouvez spécifier plusieurs dossiers, des patterns d'inclusion/exclusion et activer la compression intelligente :

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

## Télécharger le fichier généré comme artefact

Pour rendre le fichier packagé disponible pour les étapes suivantes ou pour le téléchargement, téléchargez-le comme artefact :

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

## Paramètres d'entrée de l'Action

| Nom                | Description                                   | Par défaut        |
|--------------------|-----------------------------------------------|-------------------|
| `directories`      | Liste des dossiers à packager (séparés par espace) | `.`           |
| `include`          | Patterns glob à inclure (séparés par virgule) | `""`           |
| `ignore`           | Patterns glob à exclure (séparés par virgule) | `""`           |
| `output`           | Chemin du fichier de sortie                   | `repomix.txt`     |
| `compress`         | Activer la compression intelligente           | `true`            |
| `additional-args`  | Arguments supplémentaires pour repomix CLI    | `""`           |
| `repomix-version`  | Version du package npm à installer            | `latest`          |

## Sorties de l'Action

| Nom           | Description                        |
|---------------|------------------------------------|
| `output-file` | Chemin du fichier généré            |

## Exemple de workflow complet

Voici un exemple complet de workflow GitHub Actions utilisant Repomix :

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
