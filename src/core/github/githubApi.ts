import { RepomixError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
  ref?: string; // branch, tag, or commit SHA
}

/**
 * Extracts GitHub repository information from various URL formats
 * Supports:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo/tree/branch
 * - https://github.com/owner/repo/commit/sha
 * - https://github.com/owner/repo/tree/tag
 * - owner/repo (shorthand)
 */
export const parseGitHubUrl = (url: string): GitHubRepoInfo | null => {
  // Handle shorthand format: owner/repo
  const shorthandRegex = /^([a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?)\/([a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?)$/;
  const shorthandMatch = url.match(shorthandRegex);
  if (shorthandMatch) {
    return {
      owner: shorthandMatch[1],
      repo: shorthandMatch[2],
    };
  }

  // Handle git@ SSH URLs: git@github.com:owner/repo.git
  const sshRegex = /^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/;
  const sshMatch = url.match(sshRegex);
  if (sshMatch) {
    return {
      owner: sshMatch[1],
      repo: sshMatch[2],
    };
  }

  // Handle full GitHub URLs
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') {
      return null;
    }

    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      return null;
    }

    const owner = pathParts[0];
    const repo = pathParts[1];

    // Remove .git suffix if present
    const cleanRepo = repo.replace(/\.git$/, '');

    const result: GitHubRepoInfo = { owner, repo: cleanRepo };

    // Extract ref from various URL patterns
    if (pathParts.length >= 4) {
      if (pathParts[2] === 'tree' || pathParts[2] === 'commit') {
        result.ref = pathParts.slice(3).join('/');
      }
    }

    return result;
  } catch (error) {
    logger.trace('Failed to parse GitHub URL:', (error as Error).message);
    return null;
  }
};

/**
 * Constructs GitHub archive download URL
 * Format: https://github.com/owner/repo/archive/refs/heads/branch.zip
 * For tags: https://github.com/owner/repo/archive/refs/tags/tag.zip
 * For commits: https://github.com/owner/repo/archive/commit.zip
 */
export const buildGitHubArchiveUrl = (repoInfo: GitHubRepoInfo): string => {
  const { owner, repo, ref } = repoInfo;
  const baseUrl = `https://github.com/${owner}/${repo}/archive`;

  if (!ref) {
    // Default to main branch
    return `${baseUrl}/refs/heads/main.zip`;
  }

  // Check if ref looks like a commit SHA (40 hex chars or shorter)
  const isCommitSha = /^[0-9a-f]{4,40}$/i.test(ref);
  if (isCommitSha) {
    return `${baseUrl}/${ref}.zip`;
  }

  // For branches and tags, we need to determine the type
  // Default to branch format, will fallback to tag if needed
  return `${baseUrl}/refs/heads/${ref}.zip`;
};

/**
 * Builds alternative archive URL for tags
 */
export const buildGitHubTagArchiveUrl = (repoInfo: GitHubRepoInfo): string | null => {
  const { owner, repo, ref } = repoInfo;
  if (!ref || /^[0-9a-f]{4,40}$/i.test(ref)) {
    return null; // Not applicable for commits or no ref
  }

  return `https://github.com/${owner}/${repo}/archive/refs/tags/${ref}.zip`;
};

/**
 * Validates if a URL is a GitHub repository URL
 */
export const isGitHubUrl = (url: string): boolean => {
  return parseGitHubUrl(url) !== null;
};

/**
 * Gets the expected archive filename from GitHub
 * Format: repo-branch.zip or repo-sha.zip
 */
export const getArchiveFilename = (repoInfo: GitHubRepoInfo): string => {
  const { repo, ref } = repoInfo;
  const refPart = ref || 'main';

  // GitHub uses the last part of the ref for the filename
  const refName = refPart.includes('/') ? refPart.split('/').pop() : refPart;

  return `${repo}-${refName}.zip`;
};

/**
 * Checks if a response indicates a GitHub API rate limit or error
 */
export const checkGitHubResponse = (response: Response): void => {
  if (response.status === 404) {
    throw new RepomixError(
      'Repository not found or is private. Please check the repository URL and your access permissions.',
    );
  }

  if (response.status === 403) {
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    if (rateLimitRemaining === '0') {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const resetDate = resetTime ? new Date(Number.parseInt(resetTime) * 1000) : null;
      throw new RepomixError(
        `GitHub API rate limit exceeded. ${resetDate ? `Rate limit resets at ${resetDate.toISOString()}` : 'Please try again later.'}`,
      );
    }
    throw new RepomixError(
      'Access denied. The repository might be private or you might not have permission to access it.',
    );
  }

  if (response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504) {
    throw new RepomixError('GitHub server error. Please try again later.');
  }

  if (!response.ok) {
    throw new RepomixError(`GitHub API error: ${response.status} ${response.statusText}`);
  }
};
