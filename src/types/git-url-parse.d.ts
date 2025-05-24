/**
 * Type definition extension for git-url-parse library
 * 
 * This file exists because the git-url-parse library's built-in type definitions
 * are incomplete. The library supports a second 'refs' parameter for the gitUrlParse
 * function, which is documented in the library's README but not included in its
 * type definitions.
 * 
 * Without this type definition extension, we would need to use @ts-ignore when
 * calling gitUrlParse with the refs parameter, which reduces type safety and
 * makes the code harder to maintain.
 * 
 * This file uses TypeScript's module augmentation feature to extend the existing
 * type definitions without modifying the original library code.
 * 
 * 日本語:
 * このファイルが存在する理由は、git-url-parseライブラリの組み込み型定義が不完全であるためです。
 * ライブラリはgitUrlParse関数の2番目のパラメータ'refs'をサポートしていますが、
 * これはライブラリのREADMEには記載されているものの、型定義には含まれていません。
 * 
 * この型定義拡張がなければ、refsパラメータを使用する際に@ts-ignoreを使用する必要があり、
 * 型安全性が低下し、コードの保守が難しくなります。
 * 
 * このファイルはTypeScriptのモジュール拡張機能を使用して、元のライブラリコードを
 * 変更せずに既存の型定義を拡張しています。
 */

declare module 'git-url-parse' {
  import gitUp = require('git-up');

  namespace gitUrlParse {
    interface GitUrl extends gitUp.ParsedUrl {
      /** The Git provider (e.g. `"github.com"`). */
      source: string;
      /** The repository owner. */
      owner: string;
      /** The repository name. */
      name: string;
      /** The repository ref (e.g., "master" or "dev"). */
      ref: string;
      /** A filepath relative to the repository root. */
      filepath: string;
      /** The type of filepath in the url ("blob" or "tree"). */
      filepathtype: string;
      /** The owner and name values in the `owner/name` format. */
      full_name: string;
      /** The organization the owner belongs to. This is CloudForge specific. */
      organization: string;
      /** Whether to add the `.git` suffix or not. */
      git_suffix?: boolean | undefined;
      toString(type?: string): string;
    }

    function stringify(url: GitUrl, type?: string): string;
  }

  /**
   * Parses a Git url.
   * @param url The Git url to parse.
   * @param refs An array of strings representing the refs. This is helpful for URLs with branches containing slashes.
   * @returns The GitUrl object containing parsed information.
   */
  function gitUrlParse(url: string, refs?: string[]): gitUrlParse.GitUrl;

  export = gitUrlParse;
}
