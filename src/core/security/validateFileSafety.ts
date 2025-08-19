import type { RepomixConfigMerged } from '../../config/configSchema.js';
import { logger } from '../../shared/logger.js';
import type { RepomixProgressCallback } from '../../shared/types.js';
import type { ProcessedFile, RawFile } from '../file/fileTypes.js';
import type { GitDiffResult } from '../git/gitDiffHandle.js';
import type { GitLogResult } from '../git/gitLogHandle.js';
import { filterOutUntrustedFiles } from './filterOutUntrustedFiles.js';
import { type SuspiciousFileResult, runSecurityCheck } from './securityCheck.js';

// Marks which files are suspicious and which are safe
// Returns Git diff results separately so they can be included in the output
// even if they contain sensitive information
export const validateFileSafety = async (
  rawFiles: RawFile[],
  progressCallback: RepomixProgressCallback,
  config: RepomixConfigMerged,
  gitDiffResult?: GitDiffResult,
  gitLogResult?: GitLogResult,
  deps = {
    runSecurityCheck,
    filterOutUntrustedFiles,
  },
) => {
  let suspiciousFilesResults: SuspiciousFileResult[] = [];
  let suspiciousGitDiffResults: SuspiciousFileResult[] = [];
  let suspiciousGitLogResults: SuspiciousFileResult[] = [];

  if (config.security.enableSecurityCheck) {
    progressCallback('Running security check...');
    const allResults = await deps.runSecurityCheck(rawFiles, progressCallback, gitDiffResult, gitLogResult);

    // Separate Git diff and Git log results from regular file results
    suspiciousFilesResults = allResults.filter((result) => result.type === 'file');
    suspiciousGitDiffResults = allResults.filter((result) => result.type === 'gitDiff');
    suspiciousGitLogResults = allResults.filter((result) => result.type === 'gitLog');

    if (suspiciousGitDiffResults.length > 0) {
      logger.warn('Security issues found in Git diffs, but they will still be included in the output');
      for (const result of suspiciousGitDiffResults) {
        const issueCount = result.messages.length;
        const issueText = issueCount === 1 ? 'issue' : 'issues';
        logger.warn(`  - ${result.filePath}: ${issueCount} ${issueText} detected`);
      }
    }

    if (suspiciousGitLogResults.length > 0) {
      logger.warn('Security issues found in Git logs, but they will still be included in the output');
      for (const result of suspiciousGitLogResults) {
        const issueCount = result.messages.length;
        const issueText = issueCount === 1 ? 'issue' : 'issues';
        logger.warn(`  - ${result.filePath}: ${issueCount} ${issueText} detected`);
      }
    }
  }

  const safeRawFiles = deps.filterOutUntrustedFiles(rawFiles, suspiciousFilesResults);
  const safeFilePaths = safeRawFiles.map((file) => file.path);
  logger.trace('Safe files count:', safeRawFiles.length);

  return {
    safeRawFiles,
    safeFilePaths,
    suspiciousFilesResults,
    suspiciousGitDiffResults,
    suspiciousGitLogResults,
  };
};
