import type { RepomixConfigMerged } from '../../config/configSchema.js';
import { RepomixError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';
import { execGitLog } from './gitCommand.js';
import { isGitRepository } from './gitRepositoryHandle.js';

export interface GitLogResult {
  logContent: string;
}

export const getGitLog = async (
  directory: string,
  maxCommits: number,
  deps = {
    execGitLog,
    isGitRepository,
  },
): Promise<string> => {
  if (!(await deps.isGitRepository(directory))) {
    logger.trace(`Directory ${directory} is not a git repository`);
    return '';
  }

  try {
    return await deps.execGitLog(directory, maxCommits);
  } catch (error) {
    logger.trace('Failed to get git log:', (error as Error).message);
    throw error;
  }
};

export const getGitLogs = async (
  rootDirs: string[],
  config: RepomixConfigMerged,
  deps = {
    getGitLog,
  },
): Promise<GitLogResult | undefined> => {
  // Get git logs if enabled
  let gitLogResult: GitLogResult | undefined;

  if (config.output.git?.includeLogs) {
    try {
      // Use the first directory as the git repository root
      // Usually this would be the root of the project
      const gitRoot = rootDirs[0] || config.cwd;
      const maxCommits = config.output.git?.includeLogsCount || 50;
      const logContent = await deps.getGitLog(gitRoot, maxCommits);

      gitLogResult = {
        logContent,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new RepomixError(`Failed to get git logs: ${error.message}`);
      }
    }
  }

  return gitLogResult;
};
