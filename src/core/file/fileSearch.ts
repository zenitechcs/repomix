import type { Stats } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { globby } from 'globby';
import { minimatch } from 'minimatch';
import type { RepomixConfigMerged } from '../../config/configSchema.js';
import { defaultIgnoreList } from '../../config/defaultIgnore.js';
import { RepomixError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';
import { sortPaths } from './filePathSort.js';
import { PermissionError, checkDirectoryPermissions } from './permissionCheck.js';

export interface FileSearchResult {
  filePaths: string[];
  emptyDirPaths: string[];
}

const findEmptyDirectories = async (
  rootDir: string,
  directories: string[],
  ignorePatterns: string[],
): Promise<string[]> => {
  const emptyDirs: string[] = [];

  for (const dir of directories) {
    const fullPath = path.join(rootDir, dir);
    try {
      const entries = await fs.readdir(fullPath);
      const hasVisibleContents = entries.some((entry) => !entry.startsWith('.'));

      if (!hasVisibleContents) {
        // This checks if the directory itself matches any ignore patterns
        const shouldIgnore = ignorePatterns.some((pattern) => minimatch(dir, pattern) || minimatch(`${dir}/`, pattern));

        if (!shouldIgnore) {
          emptyDirs.push(dir);
        }
      }
    } catch (error) {
      logger.debug(`Error checking directory ${dir}:`, error);
    }
  }

  return emptyDirs;
};

// Check if a path is a git worktree reference file
const isGitWorktreeRef = async (gitPath: string): Promise<boolean> => {
  try {
    const stats = await fs.stat(gitPath);
    if (!stats.isFile()) {
      return false;
    }

    const content = await fs.readFile(gitPath, 'utf8');
    return content.startsWith('gitdir:');
  } catch {
    return false;
  }
};

/**
 * Escapes special characters in glob patterns to handle paths with parentheses.
 * Example: "src/(categories)" -> "src/\\(categories\\)"
 */
export const escapeGlobPattern = (pattern: string): string => {
  // First escape backslashes
  const escapedBackslashes = pattern.replace(/\\/g, '\\\\');
  // Then escape special characters () and [], but NOT {}
  return escapedBackslashes.replace(/[()[\]]/g, '\\$&');
};

/**
 * Normalizes glob patterns by removing trailing slashes and ensuring consistent directory pattern handling.
 * Makes "**\/folder", "**\/folder/", and "**\/folder/**\/*" behave identically.
 *
 * @param pattern The glob pattern to normalize
 * @returns The normalized pattern
 */
export const normalizeGlobPattern = (pattern: string): string => {
  // Remove trailing slash but preserve patterns that end with "**/"
  if (pattern.endsWith('/') && !pattern.endsWith('**/')) {
    return pattern.slice(0, -1);
  }

  // Convert **/folder to **/folder/** for consistent ignore pattern behavior
  // Only do this for directory patterns (no file extension and no wildcard at the end)
  if (pattern.startsWith('**/') && !pattern.includes('/**') && !pattern.includes('*', 3) && !pattern.includes('.')) {
    return `${pattern}/**`;
  }

  return pattern;
};

// Get all file paths considering the config
export const searchFiles = async (
  rootDir: string,
  config: RepomixConfigMerged,
  predefinedFiles?: string[],
): Promise<FileSearchResult> => {
  // Skip directory validation when using predefined files
  if (!predefinedFiles) {
    // Check if the path exists and get its type
    let pathStats: Stats;
    try {
      pathStats = await fs.stat(rootDir);
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        const errorCode = (error as NodeJS.ErrnoException).code;
        if (errorCode === 'ENOENT') {
          throw new RepomixError(`Target path does not exist: ${rootDir}`);
        }
        if (errorCode === 'EPERM' || errorCode === 'EACCES') {
          throw new PermissionError(
            `Permission denied while accessing path. Please check folder access permissions for your terminal app. path: ${rootDir}`,
            rootDir,
            errorCode,
          );
        }
        // Handle other specific error codes with more context
        throw new RepomixError(`Failed to access path: ${rootDir}. Error code: ${errorCode}. ${error.message}`);
      }
      // Preserve original error stack trace for debugging
      const repomixError = new RepomixError(
        `Failed to access path: ${rootDir}. Reason: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
      repomixError.cause = error;
      throw repomixError;
    }

    // Check if the path is a directory
    if (!pathStats.isDirectory()) {
      throw new RepomixError(
        `Target path is not a directory: ${rootDir}. Please specify a directory path, not a file path.`,
      );
    }

    // Now check directory permissions
    const permissionCheck = await checkDirectoryPermissions(rootDir);

    if (permissionCheck.details?.read !== true) {
      if (permissionCheck.error instanceof PermissionError) {
        throw permissionCheck.error;
      }
      throw new RepomixError(
        `Target directory is not readable or does not exist. Please check folder access permissions for your terminal app.\npath: ${rootDir}`,
      );
    }
  }

  try {
    const [ignorePatterns, ignoreFilePatterns] = await Promise.all([
      getIgnorePatterns(rootDir, config),
      getIgnoreFilePatterns(config),
    ]);

    // Normalize ignore patterns to handle trailing slashes consistently
    const normalizedIgnorePatterns = ignorePatterns.map(normalizeGlobPattern);

    // Adjust ignore patterns for git worktree
    const adjustedIgnorePatterns = await adjustIgnorePatternsForWorktree(normalizedIgnorePatterns, rootDir);

    logger.trace('Ignore patterns:', normalizedIgnorePatterns);
    logger.trace('Ignore file patterns:', ignoreFilePatterns);

    const includePatterns =
      config.include.length > 0 ? config.include.map((pattern) => escapeGlobPattern(pattern)) : ['**/*'];

    logger.trace('Include patterns:', includePatterns);

    // Get file paths either from predefined files or by searching with globby
    const filePaths = predefinedFiles
      ? filterPredefinedFiles(predefinedFiles, rootDir, includePatterns, adjustedIgnorePatterns)
      : await searchFilesWithGlobby(rootDir, includePatterns, adjustedIgnorePatterns, ignoreFilePatterns);

    // Find empty directories if configured
    const emptyDirPaths = await findEmptyDirectoriesIfEnabled(
      config,
      rootDir,
      includePatterns,
      adjustedIgnorePatterns,
      ignoreFilePatterns,
      !!predefinedFiles,
    );

    logger.trace(`Filtered ${filePaths.length} files`);

    return {
      filePaths: sortPaths(filePaths),
      emptyDirPaths: sortPaths(emptyDirPaths),
    };
  } catch (error: unknown) {
    // Re-throw PermissionError as is
    if (error instanceof PermissionError) {
      throw error;
    }

    if (error instanceof Error) {
      logger.error('Error filtering files:', error.message);
      throw new Error(`Failed to filter files in directory ${rootDir}. Reason: ${error.message}`);
    }

    logger.error('An unexpected error occurred:', error);
    throw new Error('An unexpected error occurred while filtering files.');
  }
};

/**
 * Filter predefined files based on include and ignore patterns
 */
const filterPredefinedFiles = (
  predefinedFiles: string[],
  rootDir: string,
  includePatterns: string[],
  adjustedIgnorePatterns: string[],
): string[] => {
  // Convert absolute paths to relative paths for pattern matching
  const relativeFilePaths = predefinedFiles.map((filePath) => path.relative(rootDir, filePath));

  // Apply include patterns first
  const includeFilteredPaths = relativeFilePaths.filter((filePath) =>
    includePatterns.some((pattern) => minimatch(filePath, pattern)),
  );

  // Apply ignore patterns to the include-filtered paths
  const filteredFilePaths = includeFilteredPaths.filter((filePath) => {
    // Check if file matches any ignore pattern
    const isIgnored = adjustedIgnorePatterns.some((pattern) => minimatch(filePath, pattern));
    return !isIgnored;
  });

  logger.trace(`Filtered ${filteredFilePaths.length} files from ${predefinedFiles.length} predefined files`);
  return filteredFilePaths;
};

/**
 * Adjust ignore patterns for git worktree
 */
const adjustIgnorePatternsForWorktree = async (
  normalizedIgnorePatterns: string[],
  rootDir: string,
): Promise<string[]> => {
  const adjustedIgnorePatterns = [...normalizedIgnorePatterns];

  // Check if .git is a worktree reference
  const gitPath = path.join(rootDir, '.git');
  const isWorktree = await isGitWorktreeRef(gitPath);

  if (isWorktree) {
    // Remove '.git/**' pattern and add '.git' to ignore the reference file
    const gitIndex = adjustedIgnorePatterns.indexOf('.git/**');
    if (gitIndex !== -1) {
      adjustedIgnorePatterns.splice(gitIndex, 1);
      adjustedIgnorePatterns.push('.git');
    }
  }

  return adjustedIgnorePatterns;
};

/**
 * Search files using globby with error handling
 */
const searchFilesWithGlobby = async (
  rootDir: string,
  includePatterns: string[],
  adjustedIgnorePatterns: string[],
  ignoreFilePatterns: string[],
): Promise<string[]> => {
  try {
    return await globby(includePatterns, {
      cwd: rootDir,
      ignore: [...adjustedIgnorePatterns],
      ignoreFiles: [...ignoreFilePatterns],
      onlyFiles: true,
      absolute: false,
      dot: true,
      followSymbolicLinks: false,
    });
  } catch (error: unknown) {
    // Handle EPERM errors specifically
    if (error && typeof error === 'object' && 'code' in error) {
      const errorCode = (error as { code: string }).code;
      if (errorCode === 'EPERM' || errorCode === 'EACCES') {
        throw new PermissionError(
          `Permission denied while scanning directory. Please check folder access permissions for your terminal app. path: ${rootDir}`,
          rootDir,
        );
      }
    }
    throw error;
  }
};

/**
 * Find empty directories if configured to include them
 */
const findEmptyDirectoriesIfEnabled = async (
  config: RepomixConfigMerged,
  rootDir: string,
  includePatterns: string[],
  adjustedIgnorePatterns: string[],
  ignoreFilePatterns: string[],
  hasPredefinedFiles: boolean,
): Promise<string[]> => {
  if (!config.output.includeEmptyDirectories || hasPredefinedFiles) {
    // Empty directories are not applicable for predefined file lists
    return [];
  }

  const directories = await globby(includePatterns, {
    cwd: rootDir,
    ignore: [...adjustedIgnorePatterns],
    ignoreFiles: [...ignoreFilePatterns],
    onlyDirectories: true,
    absolute: false,
    dot: true,
    followSymbolicLinks: false,
  });

  return findEmptyDirectories(rootDir, directories, adjustedIgnorePatterns);
};

export const parseIgnoreContent = (content: string): string[] => {
  if (!content) return [];

  return content.split('\n').reduce<string[]>((acc, line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      acc.push(trimmedLine);
    }
    return acc;
  }, []);
};

export const getIgnoreFilePatterns = async (config: RepomixConfigMerged): Promise<string[]> => {
  const ignoreFilePatterns: string[] = [];

  if (config.ignore.useGitignore) {
    ignoreFilePatterns.push('**/.gitignore');
  }

  ignoreFilePatterns.push('**/.repomixignore');

  return ignoreFilePatterns;
};

export const getIgnorePatterns = async (rootDir: string, config: RepomixConfigMerged): Promise<string[]> => {
  const ignorePatterns = new Set<string>();

  // Add default ignore patterns
  if (config.ignore.useDefaultPatterns) {
    logger.trace('Adding default ignore patterns');
    for (const pattern of defaultIgnoreList) {
      ignorePatterns.add(pattern);
    }
  }

  // Add repomix output file
  if (config.output.filePath) {
    const absoluteOutputPath = path.resolve(config.cwd, config.output.filePath);
    const relativeToTargetPath = path.relative(rootDir, absoluteOutputPath);

    logger.trace('Adding output file to ignore patterns:', relativeToTargetPath);

    ignorePatterns.add(relativeToTargetPath);
  }

  // Add custom ignore patterns
  if (config.ignore.customPatterns) {
    logger.trace('Adding custom ignore patterns:', config.ignore.customPatterns);
    for (const pattern of config.ignore.customPatterns) {
      ignorePatterns.add(pattern);
    }
  }

  // Add patterns from .git/info/exclude if useGitignore is enabled
  if (config.ignore.useGitignore) {
    const excludeFilePath = path.join(rootDir, '.git', 'info', 'exclude');

    try {
      const excludeFileContent = await fs.readFile(excludeFilePath, 'utf8');
      const excludePatterns = parseIgnoreContent(excludeFileContent);

      for (const pattern of excludePatterns) {
        ignorePatterns.add(pattern);
      }
    } catch (error) {
      // File might not exist or might not be accessible, which is fine
      logger.trace('Could not read .git/info/exclude file:', error instanceof Error ? error.message : String(error));
    }
  }

  return Array.from(ignorePatterns);
};
