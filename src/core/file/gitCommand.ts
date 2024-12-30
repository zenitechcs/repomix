import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { logger } from '../../shared/logger.js';

const execAsync = promisify(exec);

export const isGitInstalled = async (
  deps = {
    execAsync,
  },
) => {
  try {
    const result = await deps.execAsync('git --version');
    return !result.stderr;
  } catch (error) {
    logger.trace('Git is not installed:', (error as Error).message);
    return false;
  }
};

export const execGitShallowClone = async (
  url: string,
  directory: string,
  remoteBranch?: string,
  deps = {
    execAsync,
  },
) => {
  if (remoteBranch) {
    await deps.execAsync(`git -C ${directory} init`);
    await deps.execAsync(`git -C ${directory} remote add origin ${url}`);
    try {
      await deps.execAsync(`git -C ${directory} fetch --depth 1 origin ${remoteBranch}`);
      await deps.execAsync(`git -C ${directory} checkout FETCH_HEAD`);
    } catch (err: unknown) {
      // Short SHA detection - matches 4-40 character hex string
      const maybeShortSha = remoteBranch?.match(/^[0-9a-f]{4,39}$/i);
      if (!maybeShortSha) {
        // If it's not a short SHA, rethrow the error as we can't do anything further
        throw err;
      }
      const isRefNotfoundError =
        err instanceof Error && err.message.includes(`couldn't find remote ref ${remoteBranch}`);

      if (!isRefNotfoundError) {
        // If the error is not related to a missing remote reference, it could be due to authentication failure, network issues, or other errors
        throw err;
      }

      // Maybe the error is due to a short SHA, let's try again
      // Can't use --depth 1 here as we need to fetch the specific commit
      await deps.execAsync(`git -C ${directory} fetch origin`);
      await deps.execAsync(`git -C ${directory} checkout ${remoteBranch}`);
    }
  } else {
    await deps.execAsync(`git clone --depth 1 ${url} ${directory}`);
  }

  // Clean up .git directory
  await fs.rm(path.join(directory, '.git'), { recursive: true, force: true });
};
