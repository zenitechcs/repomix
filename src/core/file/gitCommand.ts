import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { logger } from '../../shared/logger.js';

const execFileAsync = promisify(execFile);

export function isValidRemoteUrl(url: string): boolean {
  // Check the short form of the GitHub URL. e.g. yamadashy/repomix
  const shortFormRegex = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
  if (shortFormRegex.test(url)) {
    return true;
  }

  // Check the direct form of the GitHub URL. e.g.  https://github.com/yamadashy/repomix or https://gist.github.com/yamadashy/1234567890abcdef
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export const isGitInstalled = async (
  deps = {
    execFileAsync,
  },
) => {
  try {
    const result = await deps.execFileAsync('git', ['--version']);
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
    execFileAsync,
  },
) => {
  if (!isValidRemoteUrl(url)) {
    throw new Error('Invalid repository URL or user/repo format');
  }

  if (remoteBranch) {
    await deps.execFileAsync('git', ['-C', directory, 'init']);
    await deps.execFileAsync('git', ['-C', directory, 'remote', 'add', 'origin', url]);
    try {
      await deps.execFileAsync('git', ['-C', directory, 'fetch', '--depth', '1', 'origin', remoteBranch]);
      await deps.execFileAsync('git', ['-C', directory, 'checkout', 'FETCH_HEAD']);
    } catch (err: unknown) {
      // git fetch --depth 1 origin <short SHA> always throws "couldn't find remote ref" error
      const isRefNotfoundError =
        err instanceof Error && err.message.includes(`couldn't find remote ref ${remoteBranch}`);

      if (!isRefNotfoundError) {
        // Rethrow error as nothing else we can do
        throw err;
      }

      // Short SHA detection - matches a hexadecimal string of 4 to 39 characters
      // If the string matches this regex, it MIGHT be a short SHA
      // If the string doesn't match, it is DEFINITELY NOT a short SHA
      const isNotShortSHA = !remoteBranch.match(/^[0-9a-f]{4,39}$/i);

      if (isNotShortSHA) {
        // Rethrow error as nothing else we can do
        throw err;
      }

      // Maybe the error is due to a short SHA, let's try again
      // Can't use --depth 1 here as we need to fetch the specific commit
      await deps.execFileAsync('git', ['-C', directory, 'fetch', 'origin']);
      await deps.execFileAsync('git', ['-C', directory, 'checkout', remoteBranch]);
    }
  } else {
    await deps.execFileAsync('git', ['clone', '--depth', '1', url, directory]);
  }

  // Clean up .git directory
  await fs.rm(path.join(directory, '.git'), { recursive: true, force: true });
};
