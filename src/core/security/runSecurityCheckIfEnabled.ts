import { RepomixConfigMerged } from "../../config/configSchema.js";
import { RepomixProgressCallback } from "../../shared/types.js";
import { RawFile } from "../file/fileTypes.js";
import { runSecurityCheck, SuspiciousFileResult } from "./securityCheck.js";

export const runSecurityCheckIfEnabled = async (
  rawFiles: RawFile[],
  config: RepomixConfigMerged,
  progressCallback: RepomixProgressCallback,
  checkSecurity = runSecurityCheck
): Promise<SuspiciousFileResult[]> => {
  if (config.security.enableSecurityCheck) {
    progressCallback("Running security check...");
    return await checkSecurity(rawFiles, progressCallback);
  }
  return [];
};
