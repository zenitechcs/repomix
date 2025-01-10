import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import pc from 'picocolors';
import { execGitShallowClone, isGitInstalled } from '../../core/file/gitCommand.js';
import { RepomixError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';
import type { CliOptions } from '../cliRun.js';
import Spinner from '../cliSpinner.js';
import { type DefaultActionRunnerResult, runDefaultAction } from './defaultAction.js';

// Check the short form of the GitHub URL. e.g. yamadashy/repomix
const remoteNamePattern = '[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?';
const remoteNamePatternRegex = new RegExp(`^${remoteNamePattern}/${remoteNamePattern}$`);

export const runRemoteAction = async (
  repoUrl: string,
  options: CliOptions,
  deps = {
    isGitInstalled,
    execGitShallowClone,
  },
): Promise<DefaultActionRunnerResult> => {
  if (!(await deps.isGitInstalled())) {
    throw new RepomixError('Git is not installed or not in the system PATH.');
  }

  if (!isValidRemoteValue(repoUrl)) {
    throw new RepomixError('Invalid repository URL or user/repo format');
  }

  const spinner = new Spinner('Cloning repository...');

  const tempDirPath = await createTempDirectory();
  let result: DefaultActionRunnerResult;

  try {
    spinner.start();

    // Clone the repository
    await cloneRepository(formatRemoteValueToUrl(repoUrl), tempDirPath, options.remoteBranch, {
      execGitShallowClone: deps.execGitShallowClone,
    });

    spinner.succeed('Repository cloned successfully!');
    logger.log('');

    // Run the default action on the cloned repository
    result = await runDefaultAction(tempDirPath, tempDirPath, options);
    await copyOutputToCurrentDirectory(tempDirPath, process.cwd(), result.config.output.filePath);
  } catch (error) {
    spinner.fail('Error during repository cloning. cleanup...');
    throw error;
  } finally {
    // Cleanup the temporary directory
    await cleanupTempDirectory(tempDirPath);
  }

  return result;
};

export function isValidRemoteValue(remoteValue: string): boolean {
  if (remoteNamePatternRegex.test(remoteValue)) {
    return true;
  }

  // Check the direct form of the GitHub URL. e.g.  https://github.com/yamadashy/repomix or https://gist.github.com/yamadashy/1234567890abcdef
  try {
    new URL(remoteValue);
    return true;
  } catch (error) {
    return false;
  }
}

export const formatRemoteValueToUrl = (url: string): string => {
  // If the URL is in the format owner/repo, convert it to a GitHub URL
  if (remoteNamePatternRegex.test(url)) {
    logger.trace(`Formatting GitHub shorthand: ${url}`);
    return `https://github.com/${url}.git`;
  }

  // Add .git to HTTPS URLs if missing
  if (url.startsWith('https://') && !url.endsWith('.git')) {
    logger.trace(`Adding .git to HTTPS URL: ${url}`);
    return `${url}.git`;
  }

  return url;
};

export const createTempDirectory = async (): Promise<string> => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repomix-'));
  logger.trace(`Created temporary directory. (path: ${pc.dim(tempDir)})`);
  return tempDir;
};

export const cloneRepository = async (
  url: string,
  directory: string,
  remoteBranch?: string,
  deps = {
    execGitShallowClone,
  },
): Promise<void> => {
  logger.log(`Clone repository: ${url} to temporary directory. ${pc.dim(`path: ${directory}`)}`);
  logger.log('');

  try {
    await deps.execGitShallowClone(url, directory, remoteBranch);
  } catch (error) {
    throw new RepomixError(`Failed to clone repository: ${(error as Error).message}`);
  }
};

export const cleanupTempDirectory = async (directory: string): Promise<void> => {
  logger.trace(`Cleaning up temporary directory: ${directory}`);
  await fs.rm(directory, { recursive: true, force: true });
};

export const copyOutputToCurrentDirectory = async (
  sourceDir: string,
  targetDir: string,
  outputFileName: string,
): Promise<void> => {
  const sourcePath = path.join(sourceDir, outputFileName);
  const targetPath = path.join(targetDir, outputFileName);

  try {
    logger.trace(`Copying output file from: ${sourcePath} to: ${targetPath}`);
    await fs.copyFile(sourcePath, targetPath);
  } catch (error) {
    throw new RepomixError(`Failed to copy output file: ${(error as Error).message}`);
  }
};
