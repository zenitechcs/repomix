import { type RepomixConfigMerged } from "../../config/configSchema.js";
import { logger } from "../../shared/logger.js";
import { type RepomixProgressCallback } from "../../shared/types.js";
import { type RawFile } from "../file/fileTypes.js";
import { filterOutUntrustedFiles } from "./filterOutUntrustedFiles.js";
import { runSecurityCheckIfEnabled } from "./runSecurityCheckIfEnabled.js";

// marks which files are suspicious and which are safe
export const validateFileSafety = async (
  rawFiles: RawFile[],
  progressCallback: RepomixProgressCallback,
  config: RepomixConfigMerged,
  deps = {
    runSecurityCheckIfEnabled,
    filterOutUntrustedFiles,
  }
) => {
  const suspiciousFilesResults = await deps.runSecurityCheckIfEnabled(
    rawFiles,
    config,
    progressCallback
  );
  const safeRawFiles = deps.filterOutUntrustedFiles(
    rawFiles,
    suspiciousFilesResults
  );
  const safeFilePaths = safeRawFiles.map((file) => file.path);
  logger.trace("Safe files count:", safeRawFiles.length);

  return {
    safeRawFiles,
    safeFilePaths,
    suspiciousFilesResults,
  };
};
