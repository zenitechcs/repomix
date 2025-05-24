import { RepomixError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';
import {
  execGitDiff,
  execGitLogFilenames,
  execGitRevParse,
  execGitVersion,
  execLsRemote,
  validateGitUrl,
} from './gitCommand.js';

export const getFileChangeCount = async (
  directory: string,
  maxCommits = 100,
  deps = {
    execGitLogFilenames,
  },
): Promise<Record<string, number>> => {
  try {
    const filenames = await deps.execGitLogFilenames(directory, maxCommits);

    const fileChangeCounts: Record<string, number> = {};

    for (const filename of filenames) {
      fileChangeCounts[filename] = (fileChangeCounts[filename] || 0) + 1;
    }

    return fileChangeCounts;
  } catch (error) {
    logger.trace('Failed to get file change counts:', (error as Error).message);
    return {};
  }
};

export const getWorkTreeDiff = async (
  directory: string,
  deps = {
    execGitDiff,
    isGitRepository,
  },
): Promise<string> => {
  return getDiff(directory, [], deps);
};

export const getStagedDiff = async (
  directory: string,
  deps = {
    execGitDiff,
    isGitRepository,
  },
): Promise<string> => {
  return getDiff(directory, ['--cached'], deps);
};

/**
 * Helper function to get git diff with common repository check and error handling
 */
const getDiff = async (
  directory: string,
  options: string[],
  deps = {
    execGitDiff,
    isGitRepository,
  },
): Promise<string> => {
  try {
    // Check if the directory is a git repository
    const isGitRepo = await deps.isGitRepository(directory);
    if (!isGitRepo) {
      logger.trace('Not a git repository, skipping diff generation');
      return '';
    }

    // Get the diff with provided options
    const result = await deps.execGitDiff(directory, options);

    return result;
  } catch (error) {
    logger.trace('Failed to get git diff:', (error as Error).message);
    return '';
  }
};

export const isGitRepository = async (
  directory: string,
  deps = {
    execGitRevParse,
  },
): Promise<boolean> => {
  try {
    await deps.execGitRevParse(directory);
    return true;
  } catch (error) {
    return false;
  }
};

export const isGitInstalled = async (
  deps = {
    execGitVersion,
  },
): Promise<boolean> => {
  try {
    const result = await deps.execGitVersion();
    return !result.includes('error') && result.includes('git version');
  } catch (error) {
    logger.trace('Git is not installed:', (error as Error).message);
    return false;
  }
};

export const getRemoteRefs = async (
  url: string,
  deps = {
    execLsRemote,
  },
): Promise<string[]> => {
  validateGitUrl(url);

  try {
    const stdout = await deps.execLsRemote(url);

    // Extract ref names from the output
    // Format is: hash\tref_name
    const refs = stdout
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        // Skip the hash part and extract only the ref name
        const parts = line.split('\t');
        if (parts.length < 2) return '';

        // Remove 'refs/heads/' or 'refs/tags/' prefix
        return parts[1].replace(/^refs\/(heads|tags)\//, '');
      })
      .filter(Boolean);

    logger.trace(`Found ${refs.length} refs in repository: ${url}`);
    return refs;
  } catch (error) {
    logger.trace('Failed to get remote refs:', (error as Error).message);
    throw new RepomixError(`Failed to get remote refs: ${(error as Error).message}`);
  }
};
