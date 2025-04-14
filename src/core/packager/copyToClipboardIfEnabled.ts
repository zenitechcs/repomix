import { spawn } from 'node:child_process';
import clipboard from 'clipboardy';
import type { RepomixConfigMerged } from '../../config/configSchema.js';
import { logger } from '../../shared/logger.js';
import type { RepomixProgressCallback } from '../../shared/types.js';

export const copyToClipboardIfEnabled = async (
  output: string,
  progressCallback: RepomixProgressCallback,
  config: RepomixConfigMerged,
): Promise<void> => {
  if (!config.output.copyToClipboard) return;

  progressCallback('Copying to clipboard...');

  if (process.env.WAYLAND_DISPLAY) {
    logger.trace('Wayland environment detected; attempting wl-copy.');
    try {
      await new Promise<void>((resolve, reject) => {
        const child = spawn('wl-copy', [], { stdio: ['pipe', 'ignore', 'ignore'] });
        child.on('error', reject);
        child.on('close', (code) => (code ? reject(new Error(`wl-copy exited with code ${code}`)) : resolve()));
        child.stdin.end(output);
      });
      logger.trace('Successfully copied using wl-copy.');
      return;
    } catch (error: any) {
      logger.warn(`wl-copy failed (${error.message}); falling back to clipboardy.`);
    }
  }

  try {
    logger.trace('Using clipboardy for copying.');
    await clipboard.write(output);
    logger.trace('Successfully copied using clipboardy.');
  } catch (error: any) {
    logger.error(`clipboardy failed: ${error.message}`);
  }
};
