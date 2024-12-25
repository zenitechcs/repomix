import { describe, expect, it, vi } from 'vitest';
import type { RepomixConfigMerged } from '../../../src/config/configSchema.js';
import type { RawFile } from '../../../src/core/file/fileTypes.js';
import { runSecurityCheckIfEnabled } from '../../../src/core/security/runSecurityCheckIfEnabled.js';
import type { SuspiciousFileResult } from '../../../src/core/security/securityCheck.js';
import type { RepomixProgressCallback } from '../../../src/shared/types.js';

describe('runSecurityCheckIfEnabled', () => {
  it('should run security check if enabled in config', async () => {
    const rawFiles: RawFile[] = [
      { path: 'file1.txt', content: 'contents1' },
      { path: 'file2.txt', content: 'contents2' },
    ];
    const config: RepomixConfigMerged = {
      security: { enableSecurityCheck: true },
    } as RepomixConfigMerged;
    const progressCallback: RepomixProgressCallback = vi.fn();
    const checkSecurity = vi.fn().mockResolvedValue([{ filePath: 'file1.txt' }] as SuspiciousFileResult[]);

    const result = await runSecurityCheckIfEnabled(rawFiles, config, progressCallback, checkSecurity);

    expect(progressCallback).toHaveBeenCalledWith('Running security check...');
    expect(checkSecurity).toHaveBeenCalledWith(rawFiles, progressCallback);
    expect(result).toEqual([{ filePath: 'file1.txt' }]);
  });

  it('should not run security check if disabled in config', async () => {
    const rawFiles: RawFile[] = [
      { path: 'file1.txt', content: 'contents1' },
      { path: 'file2.txt', content: 'contents2' },
    ];
    const config: RepomixConfigMerged = {
      security: { enableSecurityCheck: false },
    } as RepomixConfigMerged;
    const progressCallback: RepomixProgressCallback = vi.fn();
    const checkSecurity = vi.fn();

    const result = await runSecurityCheckIfEnabled(rawFiles, config, progressCallback, checkSecurity);

    expect(progressCallback).not.toHaveBeenCalled();
    expect(checkSecurity).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
