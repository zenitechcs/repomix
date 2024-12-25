import type { RepomixConfigMerged } from '../../config/configSchema.js';
import type { RepomixProgressCallback } from '../../shared/types.js';
import type { RawFile } from '../file/fileTypes.js';
import { type SuspiciousFileResult, runSecurityCheck } from './securityCheck.js';

export const runSecurityCheckIfEnabled = async (
  rawFiles: RawFile[],
  config: RepomixConfigMerged,
  progressCallback: RepomixProgressCallback,
  checkSecurity = runSecurityCheck,
): Promise<SuspiciousFileResult[]> => {
  if (config.security.enableSecurityCheck) {
    progressCallback('Running security check...');
    return await checkSecurity(rawFiles, progressCallback);
  }
  return [];
};
