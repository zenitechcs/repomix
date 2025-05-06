import type { RepomixConfigMerged } from '../../config/configSchema.js';
import { RepomixError } from '../../shared/errorHandle.js';
import { getStagedDiff, getWorkTreeDiff } from './gitCommand.js';

export interface GitDiffResult {
  workTreeDiffContent: string;
  stagedDiffContent: string;
}

export const getGitDiffs = async (
  rootDirs: string[],
  config: RepomixConfigMerged,
  deps = {
    getWorkTreeDiff,
    getStagedDiff,
  },
): Promise<GitDiffResult | undefined> => {
  // Get git diffs if enabled
  let gitDiffResult: GitDiffResult | undefined;

  if (config.output.git?.includeDiffs) {
    try {
      // Use the first directory as the git repository root
      // Usually this would be the root of the project
      gitDiffResult = {
        workTreeDiffContent: await deps.getWorkTreeDiff(rootDirs[0] || config.cwd),
        stagedDiffContent: await deps.getStagedDiff(rootDirs[0] || config.cwd),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new RepomixError(`Failed to get git diffs: ${error.message}`);
      }
    }
  }

  return gitDiffResult;
};
