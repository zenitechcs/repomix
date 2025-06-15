import { createWriteStream } from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { unzip } from 'fflate';
import { RepomixError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';
import {
  buildGitHubArchiveUrl,
  buildGitHubTagArchiveUrl,
  checkGitHubResponse,
  getArchiveFilename,
} from './gitHubArchiveApi.js';
import type { GitHubRepoInfo } from './gitRemoteParse.js';

export interface ArchiveDownloadOptions {
  timeout?: number; // Download timeout in milliseconds (default: 30000)
  retries?: number; // Number of retry attempts (default: 3)
}

export interface ArchiveDownloadProgress {
  downloaded: number;
  total: number | null;
  percentage: number | null;
}

export type ProgressCallback = (progress: ArchiveDownloadProgress) => void;

/**
 * Downloads and extracts a GitHub repository archive
 */
export const downloadGitHubArchive = async (
  repoInfo: GitHubRepoInfo,
  targetDirectory: string,
  options: ArchiveDownloadOptions = {},
  onProgress?: ProgressCallback,
  deps = {
    fetch: globalThis.fetch,
    fs,
    pipeline,
    createWriteStream,
  },
): Promise<void> => {
  const { timeout = 30000, retries = 3 } = options;

  // Ensure target directory exists
  await deps.fs.mkdir(targetDirectory, { recursive: true });

  let lastError: Error | null = null;

  // Try downloading with branch format first, then tag format if it fails
  const archiveUrls = [buildGitHubArchiveUrl(repoInfo), buildGitHubTagArchiveUrl(repoInfo)].filter(Boolean) as string[];

  for (const archiveUrl of archiveUrls) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.trace(`Downloading GitHub archive from: ${archiveUrl} (attempt ${attempt}/${retries})`);

        await downloadAndExtractArchive(archiveUrl, targetDirectory, repoInfo, timeout, onProgress, deps);

        logger.trace('Successfully downloaded and extracted GitHub archive');
        return; // Success - exit early
      } catch (error) {
        lastError = error as Error;
        logger.trace(`Archive download attempt ${attempt} failed:`, lastError.message);

        // If it's a 404 and we have more URLs to try, don't retry this URL
        if (lastError.message.includes('not found') && archiveUrls.length > 1) {
          break;
        }

        // If it's the last attempt, don't wait
        if (attempt < retries) {
          const delay = Math.min(1000 * 2 ** (attempt - 1), 5000); // Exponential backoff, max 5s
          logger.trace(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  // If we get here, all attempts failed
  throw new RepomixError(
    `Failed to download GitHub archive after ${retries} attempts. ${lastError?.message || 'Unknown error'}`,
  );
};

/**
 * Downloads and extracts archive from a single URL
 */
const downloadAndExtractArchive = async (
  archiveUrl: string,
  targetDirectory: string,
  repoInfo: GitHubRepoInfo,
  timeout: number,
  onProgress?: ProgressCallback,
  deps = {
    fetch: globalThis.fetch,
    fs,
    pipeline,
    createWriteStream,
  },
): Promise<void> => {
  // Download the archive
  const tempArchivePath = path.join(targetDirectory, getArchiveFilename(repoInfo));

  await downloadFile(archiveUrl, tempArchivePath, timeout, onProgress, deps);

  try {
    // Extract the archive
    await extractZipArchive(tempArchivePath, targetDirectory, repoInfo, deps);
  } finally {
    // Clean up the downloaded archive file
    try {
      await deps.fs.unlink(tempArchivePath);
    } catch (error) {
      logger.trace('Failed to cleanup archive file:', (error as Error).message);
    }
  }
};

/**
 * Downloads a file from URL with progress tracking
 */
const downloadFile = async (
  url: string,
  filePath: string,
  timeout: number,
  onProgress?: ProgressCallback,
  deps = {
    fetch: globalThis.fetch,
    fs,
    pipeline,
    createWriteStream,
  },
): Promise<void> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await deps.fetch(url, {
      signal: controller.signal,
    });

    checkGitHubResponse(response);

    if (!response.body) {
      throw new RepomixError('No response body received');
    }

    const totalSize = response.headers.get('content-length');
    const total = totalSize ? Number.parseInt(totalSize, 10) : null;
    let downloaded = 0;

    // Create progress tracking readable stream
    const progressStream = new Readable({
      read() {},
    });

    // Convert web ReadableStream to Node.js Readable stream with progress tracking
    const reader = response.body.getReader();
    const pump = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            progressStream.push(null); // End stream
            break;
          }

          downloaded += value.length;

          if (onProgress && total) {
            onProgress({
              downloaded,
              total,
              percentage: Math.round((downloaded / total) * 100),
            });
          }

          progressStream.push(Buffer.from(value));
        }
      } catch (error) {
        progressStream.destroy(error as Error);
      }
    };

    // Start pumping data
    pump();

    // Write to file
    const writeStream = deps.createWriteStream(filePath);
    await deps.pipeline(progressStream, writeStream);
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Extracts a ZIP archive using fflate library
 */
const extractZipArchive = async (
  archivePath: string,
  targetDirectory: string,
  repoInfo: GitHubRepoInfo,
  deps = {
    fs,
  },
): Promise<void> => {
  try {
    // Read the ZIP file as a buffer
    const zipBuffer = await deps.fs.readFile(archivePath);
    const zipUint8Array = new Uint8Array(zipBuffer);

    // Extract ZIP using fflate
    await new Promise<void>((resolve, reject) => {
      unzip(zipUint8Array, async (err, extracted) => {
        if (err) {
          reject(new RepomixError(`Failed to extract ZIP archive: ${err.message}`));
          return;
        }

        try {
          // Process extracted files
          const repoPrefix = `${repoInfo.repo}-`;

          for (const [filePath, fileData] of Object.entries(extracted)) {
            // GitHub archives have a top-level directory like "repo-branch/"
            // We need to remove this prefix from the file paths
            let relativePath = filePath;

            // Find and remove the repo prefix
            const pathParts = filePath.split('/');
            if (pathParts.length > 0 && pathParts[0].startsWith(repoPrefix)) {
              // Remove the first directory (repo-branch/)
              relativePath = pathParts.slice(1).join('/');
            }

            // Skip empty paths (root directory)
            if (!relativePath) {
              continue;
            }

            const targetPath = path.join(targetDirectory, relativePath);

            // Ensure parent directory exists
            const parentDir = path.dirname(targetPath);
            await deps.fs.mkdir(parentDir, { recursive: true });

            // Write file
            await deps.fs.writeFile(targetPath, fileData);
          }

          resolve();
        } catch (writeError) {
          reject(new RepomixError(`Failed to write extracted files: ${(writeError as Error).message}`));
        }
      });
    });
  } catch (error) {
    throw new RepomixError(`Failed to extract archive: ${(error as Error).message}`);
  }
};

/**
 * Checks if archive download is supported for the given repository info
 */
export const isArchiveDownloadSupported = (_repoInfo: GitHubRepoInfo): boolean => {
  // Archive download is supported for all GitHub repositories
  // In the future, we might add conditions here (e.g., size limits, private repos)
  return true;
};

/**
 * Estimates download size (returns null if cannot determine)
 * This could be enhanced to make a HEAD request to get content-length
 */
export const estimateDownloadSize = async (
  repoInfo: GitHubRepoInfo,
  deps = {
    fetch: globalThis.fetch,
  },
): Promise<number | null> => {
  try {
    const archiveUrl = buildGitHubArchiveUrl(repoInfo);
    const response = await deps.fetch(archiveUrl, { method: 'HEAD' });

    if (!response.ok) {
      return null;
    }

    const contentLength = response.headers.get('content-length');
    return contentLength ? Number.parseInt(contentLength, 10) : null;
  } catch (error) {
    logger.trace('Failed to estimate download size:', (error as Error).message);
    return null;
  }
};
