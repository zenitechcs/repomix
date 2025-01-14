# インストール

Repomix を使用するには、まずお使いの環境に Repomix をインストールする必要があります。このドキュメントでは、Repomix のインストール手順と、インストール後の初期設定について説明します。

## 前提条件

Repomix をインストールする前に、以下のソフトウェアがインストールされていることを確認してください。

- **Node.js:** Repomix は Node.js 上で動作します。Node.js の最新の LTS バージョンを推奨します。
- **npm または yarn:** Node.js のパッケージマネージャーである npm または yarn がインストールされている必要があります。

## インストール手順

Repomix は、npm または yarn を使用してグローバルにインストールできます。

### npm を使用する場合

```bash
npm install -g repomix
```

### yarn を使用する場合

```bash
yarn global add repomix
```

上記のコマンドを実行すると、Repomix がグローバルにインストールされ、コマンドラインから `repomix` コマンドを使用できるようになります。

## インストールの確認

インストールが完了したら、以下のコマンドを実行して Repomix のバージョンを確認します。

```bash
repomix --version
```

バージョン情報が表示されれば、インストールは成功しています。

## 補完機能の設定（オプション）

Repomix のコマンド補完機能を設定することで、コマンド入力がより簡単になります。

### bash の場合

`.bashrc` または `.bash_profile` に以下の行を追加します。

```bash
eval "$(_REPOMIX_COMPLETE=source repomix)"
```

設定後、ターミナルを再起動するか、以下のコマンドを実行して設定を反映します。

```bash
source ~/.bashrc
```

または

```bash
source ~/.bash_profile
```

### zsh の場合

`.zshrc` に以下の行を追加します。

```bash
eval "$(_REPOMIX_COMPLETE=source_zsh repomix)"
```

設定後、ターミナルを再起動するか、以下のコマンドを実行して設定を反映します。

```bash
source ~/.zshrc
```

### fish の場合

`~/.config/fish/config.fish` に以下の行を追加します。

```fish
complete -c repomix -f
```

設定後、新しいターミナルを開くと補完が有効になります。

## トラブルシューティング

インストール中に問題が発生した場合は、以下の点を確認してください。

- **Node.js と npm (または yarn) のバージョン:** 古いバージョンを使用している場合は、最新バージョンにアップデートしてください。
- **ネットワーク接続:** パッケージのダウンロードにはインターネット接続が必要です。
- **権限:** グローバルインストールには管理者権限が必要な場合があります。

## アップグレード

Repomix の新しいバージョンがリリースされた場合は、以下のコマンドでアップグレードできます。

### npm を使用する場合

```bash
npm update -g repomix
```

### yarn を使用する場合

```bash
yarn global upgrade repomix
```

## アンインストール

Repomix をアンインストールする場合は、以下のコマンドを実行します。

### npm を使用する場合

```bash
npm uninstall -g repomix
```

### yarn を使用する場合

```bash
yarn global remove repomix
```

## まとめ

このドキュメントでは、Repomix のインストール手順について説明しました。インストールが完了したら、Repomix を使用してコードの分析や変更を開始できます。
