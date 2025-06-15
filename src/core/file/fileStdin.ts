import path from 'node:path';
import readline from 'node:readline/promises';
import { RepomixError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';

export interface StdinFileResult {
  filePaths: string[];
  emptyDirPaths: string[];
}

/**
 * Reads file paths from stdin, one per line.
 * Filters out empty lines and comments (lines starting with #).
 * Converts relative paths to absolute paths based on the current working directory.
 */
export const readFilePathsFromStdin = async (cwd: string): Promise<StdinFileResult> => {
  logger.trace('Reading file paths from stdin...');

  try {
    const stdin = process.stdin;

    // Check if stdin is a TTY (interactive mode)
    if (stdin.isTTY) {
      throw new RepomixError('No data provided via stdin. Please pipe file paths to repomix when using --stdin flag.');
    }

    // Use readline for memory-efficient line-by-line processing
    const rl = readline.createInterface({ input: stdin });
    const lines: string[] = [];

    for await (const line of rl) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        lines.push(trimmed);
      }
    }

    if (lines.length === 0) {
      throw new RepomixError('No valid file paths found in stdin input.');
    }

    // Convert relative paths to absolute paths and deduplicate
    const filePaths = [
      ...new Set(
        lines.map((line) => {
          const filePath = path.isAbsolute(line) ? path.normalize(line) : path.normalize(path.resolve(cwd, line));
          logger.trace(`Resolved path: ${line} -> ${filePath}`);
          return filePath;
        }),
      ),
    ];

    logger.trace(`Found ${filePaths.length} file paths from stdin`);

    return {
      filePaths,
      emptyDirPaths: [], // Empty directories not supported with stdin input
    };
  } catch (error) {
    if (error instanceof RepomixError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new RepomixError(`Failed to read file paths from stdin: ${error.message}`);
    }

    throw new RepomixError('An unexpected error occurred while reading from stdin.');
  }
};
