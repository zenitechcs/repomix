import { queryC } from './queries/c.js';
import { queryCSharp } from './queries/cSharp.js';
import { queryCpp } from './queries/cpp.js';
import { queryGo } from './queries/go.js';
import { queryJava } from './queries/java.js';
import { queryJavascript } from './queries/javascript.js';
import { queryPhp } from './queries/php.js';
import { queryPython } from './queries/python.js';
import { queryRuby } from './queries/ruby.js';
import { queryRust } from './queries/rust.js';
import { querySwift } from './queries/swift.js';
import { queryTypescript } from './queries/typescript.js';

export const lang2Query = {
  javascript: queryJavascript,
  typescript: queryTypescript,
  c: queryC,
  cpp: queryCpp,
  python: queryPython,
  rust: queryRust,
  go: queryGo,
  c_sharp: queryCSharp,
  ruby: queryRuby,
  java: queryJava,
  php: queryPhp,
  swift: querySwift,
};

export type SupportedLang = keyof typeof lang2Query;
