import type { Ace } from 'ace-builds';
import { analyticsUtils } from './analytics';

/**
 * Format timestamp to locale string
 */
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Handle clipboard copy with analytics tracking
 */
export async function copyToClipboard(content: string, format: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    analyticsUtils.trackCopyOutput(format);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Handle file download with analytics tracking
 */
export function downloadResult(content: string, format: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  const extension = format === 'markdown' ? 'md' : format === 'xml' ? 'xml' : 'txt';

  a.href = url;
  a.download = `repomix-output.${extension}`;
  document.body.appendChild(a);
  a.click();

  analyticsUtils.trackDownloadOutput(format);
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Get Ace editor options
 */
export function getEditorOptions(): Partial<Ace.EditorOptions> {
  return {
    readOnly: true,
    wrap: false,
    showPrintMargin: false,
    fontSize: '13px',
    useWorker: false,
    highlightActiveLine: false,
  };
}
