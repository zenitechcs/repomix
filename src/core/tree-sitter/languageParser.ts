import * as path from 'node:path';
import Parser from 'web-tree-sitter';

import { RepomixError } from '../../shared/errorHandle.js';
import { ext2Lang } from './ext2Lang.js';
import { type SupportedLang, lang2Query } from './lang2Query.js';
import { loadLanguage } from './loadLanguage.js';

export class LanguageParser {
  private loadedParsers: {
    [key: string]: Parser;
  } = {};

  private loadedQueries: {
    [key: string]: Parser.Query;
  } = {};

  private getFileExtension(filePath: string) {
    return path.extname(filePath).toLowerCase().slice(1);
  }

  private async prepareLang(name: SupportedLang) {
    try {
      const lang = await loadLanguage(name);
      const parser = new Parser();
      parser.setLanguage(lang);
      this.loadedParsers[name] = parser;
      this.loadedQueries[name] = lang.query(lang2Query[name]);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new RepomixError(`Failed to prepare language ${name}: ${message}`);
    }
  }
  // 'name' is name of the language
  public async getParserForLang(name: SupportedLang) {
    if (!this.loadedParsers[name]) {
      await this.prepareLang(name);
    }
    return this.loadedParsers[name];
  }

  // 'name' is name of the language
  public async getQueryForLang(name: SupportedLang) {
    if (!this.loadedQueries[name]) {
      await this.prepareLang(name);
    }
    return this.loadedQueries[name];
  }

  public guessTheLang(filePath: string): SupportedLang | undefined {
    const ext = this.getFileExtension(filePath);
    if (!Object.keys(ext2Lang).includes(ext)) {
      return undefined;
    }
    const lang = ext2Lang[ext as keyof typeof ext2Lang] as SupportedLang;
    return lang;
  }

  public async init() {
    try {
      await Parser.init();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to initialize parser: ${message}`);
    }
  }
}
