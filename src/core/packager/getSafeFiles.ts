import { type RepomixProgressCallback } from "../../shared/types.js";
import { type RawFile } from "../file/fileTypes.js";
import {
  runSecurityCheck,
  type SuspiciousFileResult,
} from "../security/securityCheck.js";
import { logger } from "../../shared/logger.js";
import { RepomixConfigMerged } from "../../config/configSchema.js";

export const getSafeFiles = async (
  rawFiles: RawFile[],
  progressCallback: RepomixProgressCallback,
  config: RepomixConfigMerged,
  checkSecurity = runSecurityCheck
) => {
  let safeRawFiles = rawFiles;
  let suspiciousFilesResults: SuspiciousFileResult[] = [];

  if (config.security.enableSecurityCheck) {
    progressCallback("Running security check...");
    suspiciousFilesResults = await checkSecurity(rawFiles, progressCallback);
    safeRawFiles = rawFiles.filter(
      (rawFile) =>
        !suspiciousFilesResults.some(
          (result) => result.filePath === rawFile.path
        )
    );
  }

  const safeFilePaths = safeRawFiles.map((file) => file.path);
  logger.trace("Safe files count:", safeRawFiles.length);

  return {
    safeRawFiles,
    safeFilePaths,
    suspiciousFilesResults,
  };
};
