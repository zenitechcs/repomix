import gitUrlParse, { type GitUrl } from 'git-url-parse';
import { RepomixError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';
import { type GitHubRepoInfo, parseGitHubUrl } from '../github/githubApi.js';

interface IGitUrl extends GitUrl {
  commit: string | undefined;
}

// Check the short form of the GitHub URL. e.g. yamadashy/repomix
const VALID_NAME_PATTERN = '[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?';
const validShorthandRegex = new RegExp(`^${VALID_NAME_PATTERN}/${VALID_NAME_PATTERN}$`);
export const isValidShorthand = (remoteValue: string): boolean => {
  return validShorthandRegex.test(remoteValue);
};

export const parseRemoteValue = (
  remoteValue: string,
  refs: string[] = [],
): { repoUrl: string; remoteBranch: string | undefined } => {
  if (isValidShorthand(remoteValue)) {
    logger.trace(`Formatting GitHub shorthand: ${remoteValue}`);
    return {
      repoUrl: `https://github.com/${remoteValue}.git`,
      remoteBranch: undefined,
    };
  }

  try {
    const parsedFields = gitUrlParse(remoteValue, refs) as IGitUrl;

    // This will make parsedFields.toString() automatically append '.git' to the returned url
    parsedFields.git_suffix = true;

    const ownerSlashRepo =
      parsedFields.full_name.split('/').length > 1 ? parsedFields.full_name.split('/').slice(-2).join('/') : '';

    if (ownerSlashRepo !== '' && !isValidShorthand(ownerSlashRepo)) {
      throw new RepomixError('Invalid owner/repo in repo URL');
    }

    const repoUrl = parsedFields.toString(parsedFields.protocol);

    if (parsedFields.ref) {
      return {
        repoUrl: repoUrl,
        remoteBranch: parsedFields.ref,
      };
    }

    if (parsedFields.commit) {
      return {
        repoUrl: repoUrl,
        remoteBranch: parsedFields.commit,
      };
    }

    return {
      repoUrl: repoUrl,
      remoteBranch: undefined,
    };
  } catch (error) {
    throw new RepomixError('Invalid remote repository URL or repository shorthand (owner/repo)');
  }
};

export const isValidRemoteValue = (remoteValue: string, refs: string[] = []): boolean => {
  try {
    parseRemoteValue(remoteValue, refs);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Parses remote value and extracts GitHub repository information if it's a GitHub repo
 * Returns null if the remote value is not a GitHub repository
 */
export const parseGitHubRepoInfo = (remoteValue: string): GitHubRepoInfo | null => {
  try {
    // First try direct GitHub URL parsing
    const githubInfo = parseGitHubUrl(remoteValue);
    if (githubInfo) {
      return githubInfo;
    }

    // If direct parsing failed, try using the existing git URL parsing
    // and extract GitHub info from the result
    const parsed = parseRemoteValue(remoteValue);
    const githubInfoFromGitUrl = parseGitHubUrl(parsed.repoUrl);

    if (githubInfoFromGitUrl) {
      // Override ref with remoteBranch if available
      return {
        ...githubInfoFromGitUrl,
        ref: parsed.remoteBranch || githubInfoFromGitUrl.ref,
      };
    }

    return null;
  } catch (error) {
    logger.trace('Failed to parse GitHub repo info:', (error as Error).message);
    return null;
  }
};

/**
 * Checks if a remote value represents a GitHub repository
 */
export const isGitHubRepository = (remoteValue: string): boolean => {
  return parseGitHubRepoInfo(remoteValue) !== null;
};
