import type { RepomixConfigMerged } from '../../config/configSchema.js';
import { RepomixError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';
import { execGitLog } from './gitCommand.js';
import { isGitRepository } from './gitRepositoryHandle.js';

export interface GitLogCommit {
  date: string;
  message: string;
  files: string[];
}

export interface GitLogResult {
  logContent: string;
  commits: GitLogCommit[];
}

const parseGitLog = (rawLogOutput: string): GitLogCommit[] => {
  if (!rawLogOutput.trim()) {
    return [];
  }

  const commits: GitLogCommit[] = [];
  const logEntries = rawLogOutput.split('\n\n');

  for (const entry of logEntries) {
    const lines = entry.split('\n').filter((line) => line.trim() !== '');
    if (lines.length === 0) continue;

    // First line contains date and message separated by |
    const firstLine = lines[0];
    const separatorIndex = firstLine.indexOf('|');
    if (separatorIndex === -1) continue;

    const date = firstLine.substring(0, separatorIndex);
    const message = firstLine.substring(separatorIndex + 1);

    // Remaining lines are file paths
    const files = lines.slice(1).filter((line) => line.trim() !== '');

    commits.push({
      date,
      message,
      files,
    });
  }

  return commits;
};

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

      // Parse the raw log content into structured commits
      const commits = parseGitLog(logContent);

      gitLogResult = {
        logContent,
        commits,
      };
    } catch (error) {
      throw new RepomixError(`Failed to get git logs: ${(error as Error).message}`, { cause: error });
    }
  }

  return gitLogResult;
};
