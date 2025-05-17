# Configuration

## Démarrage rapide

Créer un fichier de configuration :
```bash
repomix --init
```

## Options de configuration

| Option                           | Description                                                                                                                  | Valeur par défaut      |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `input.maxFileSize`              | Taille maximale des fichiers en octets à traiter. Les fichiers plus grands seront ignorés                                   | `50000000`            |
| `output.filePath`                | Nom du fichier de sortie                                                                                                     | `"repomix-output.xml"` |
| `output.style`                   | Style de sortie (`xml`, `markdown`, `plain`)                                                                                 | `"xml"`                |
| `output.parsableStyle`           | Si la sortie doit être échappée selon le schéma de style choisi. Notez que cela peut augmenter le nombre de tokens          | `false`                |
| `output.compress`                | Si une extraction intelligente du code doit être effectuée pour réduire le nombre de tokens                                  | `false`                |
| `output.headerText`              | Texte personnalisé à inclure dans l'en-tête du fichier                                                                      | `null`                 |
| `output.instructionFilePath`     | Chemin vers un fichier contenant des instructions personnalisées détaillées                                                  | `null`                 |
| `output.fileSummary`             | Si une section de résumé doit être incluse au début de la sortie                                                            | `true`                 |
| `output.directoryStructure`      | Si la structure des répertoires doit être incluse dans la sortie                                                            | `true`                 |
| `output.files`                   | Si le contenu des fichiers doit être inclus dans la sortie                                                                  | `true`                 |
| `output.removeComments`          | Si les commentaires doivent être supprimés des types de fichiers pris en charge                                             | `false`                |
| `output.removeEmptyLines`        | Si les lignes vides doivent être supprimées de la sortie                                                                    | `false`                |
| `output.showLineNumbers`         | Si les numéros de ligne doivent être ajoutés à chaque ligne                                                                 | `false`                |
| `output.copyToClipboard`         | Si la sortie doit être copiée dans le presse-papiers système en plus d'être sauvegardée                                     | `false`                |
| `output.topFilesLength`          | Nombre de fichiers principaux à afficher dans le résumé. Si défini à 0, aucun résumé ne sera affiché                       | `5`                    |
| `output.includeEmptyDirectories` | Si les répertoires vides doivent être inclus dans la structure du dépôt                                                     | `false`                |
| `output.git.sortByChanges`       | Si les fichiers doivent être triés par nombre de modifications Git (les fichiers plus modifiés apparaissent en bas)         | `true`                 |
| `output.git.sortByChangesMaxCommits` | Nombre maximum de commits à analyser pour les modifications Git                                                          | `100`                  |
| `output.git.includeDiffs`        | Si les différences Git doivent être incluses dans la sortie (inclut séparément les modifications de l'arbre de travail et de la zone de staging) | `false`                |
| `include`                        | Motifs des fichiers à inclure (utilise les [motifs glob](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)) | `[]`                   |
| `ignore.useGitignore`            | Si les motifs du fichier `.gitignore` du projet doivent être utilisés                                                       | `true`                 |
| `ignore.useDefaultPatterns`      | Si les motifs d'ignorance par défaut doivent être utilisés                                                                  | `true`                 |
| `ignore.customPatterns`          | Motifs d'ignorance supplémentaires (utilise les [motifs glob](https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#pattern-syntax)) | `[]`                   |
| `security.enableSecurityCheck`   | Si les vérifications de sécurité doivent être effectuées sur les fichiers                                                   | `true`                 |
| `tokenCount.encoding`            | Encodage de comptage des tokens utilisé par le tokenizer [tiktoken](https://github.com/openai/tiktoken) d'OpenAI (par exemple, `o200k_base` pour GPT-4o, `cl100k_base` pour GPT-4/3.5). Voir [tiktoken model.py](https://github.com/openai/tiktoken/blob/main/tiktoken/model.py#L24) pour les détails. | `"o200k_base"`         |

Le fichier de configuration prend en charge la syntaxe [JSON5](https://json5.org/), qui permet :
- Les commentaires (sur une ligne et sur plusieurs lignes)
- Les virgules finales dans les objets et les tableaux
- Les noms de propriétés sans guillemets
- Une syntaxe de chaîne plus flexible

## Exemple de fichier de configuration

Voici un exemple de fichier de configuration complet (`repomix.config.json`) :

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
    "headerText": "Informations d'en-tête personnalisées pour le fichier empaqueté",
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
    // Les motifs peuvent également être spécifiés dans .repomixignore
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

## Configuration globale

Créer une configuration globale :
```bash
repomix --init --global
```

Emplacement :
- Windows : `%LOCALAPPDATA%\Repomix\repomix.config.json`
- macOS/Linux : `~/.config/repomix/repomix.config.json`

## Motifs d'ignorance

Priorité :
1. Options CLI (`--ignore`)
2. `.repomixignore`
3. `.gitignore` et `.git/info/exclude`
4. Motifs par défaut

Exemple de `.repomixignore` :
```text
# Répertoires de cache
.cache/
tmp/

# Sorties de build
dist/
build/

# Logs
*.log
```

## Motifs d'ignorance par défaut

Motifs courants inclus par défaut :
```text
node_modules/**
.git/**
coverage/**
dist/**
```

Liste complète : [defaultIgnore.ts](https://github.com/yamadashy/repomix/blob/main/src/config/defaultIgnore.ts)

## Exemples

### Compression de code

Lorsque `output.compress` est défini sur `true`, Repomix extrait les structures de code essentielles tout en supprimant les détails d'implémentation. Cela aide à réduire le nombre de tokens tout en conservant les informations structurelles importantes.

Pour plus de détails et d'exemples, consultez le [Guide de compression de code](code-compress).

### Intégration Git

La configuration `output.git` vous permet de contrôler comment les fichiers sont triés en fonction de l'historique Git et comment inclure les différences Git :

- `sortByChanges` : Lorsque défini sur `true`, les fichiers sont triés par nombre de modifications Git (commits qui ont modifié le fichier). Les fichiers avec plus de modifications apparaissent en bas de la sortie. Cela aide à prioriser les fichiers plus activement développés. Valeur par défaut : `true`
- `sortByChangesMaxCommits` : Nombre maximum de commits à analyser lors du comptage des modifications de fichiers. Valeur par défaut : `100`
- `includeDiffs` : Lorsque défini sur `true`, inclut les différences Git dans la sortie (inclut séparément les modifications de l'arbre de travail et de la zone de staging). Cela permet au lecteur de voir les modifications en attente dans le dépôt. Valeur par défaut : `false`

Exemple de configuration :
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

### Suppression des commentaires

Lorsque `output.removeComments` est défini sur `true`, les commentaires sont supprimés des types de fichiers pris en charge pour réduire la taille de la sortie et se concentrer sur le contenu du code essentiel.

Pour les langages pris en charge et des exemples détaillés, consultez le [Guide de suppression des commentaires](comment-removal).
