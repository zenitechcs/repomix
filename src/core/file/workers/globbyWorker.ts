import { type Options, globby } from 'globby';

export interface GlobbyTask {
  patterns: string[];
  options: Options;
}

export default async ({ patterns, options }: GlobbyTask): Promise<string[]> => {
  return globby(patterns, options);
};
