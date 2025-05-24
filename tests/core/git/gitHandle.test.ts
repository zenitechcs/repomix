import { beforeEach, describe, expect, test, vi } from 'vitest';
import { getFileChangeCount } from '../../../src/core/git/gitHandle.js';
import { logger } from '../../../src/shared/logger.js';

vi.mock('../../../src/shared/logger');

describe('gitHandle', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getFileChangeCount', () => {
    test('should count file changes correctly', async () => {
      const mockFilenames = ['file1.ts', 'file2.ts', 'file1.ts', 'file3.ts', 'file2.ts'];

      const mockExecGitLogFilenames = vi.fn().mockResolvedValue(mockFilenames);

      const result = await getFileChangeCount('/test/dir', 5, {
        execGitLogFilenames: mockExecGitLogFilenames,
      });

      expect(result).toEqual({
        'file1.ts': 2,
        'file2.ts': 2,
        'file3.ts': 1,
      });
      expect(mockExecGitLogFilenames).toHaveBeenCalledWith('/test/dir', 5);
    });

    test('should return empty object when git command fails', async () => {
      const mockExecGitLogFilenames = vi.fn().mockRejectedValue(new Error('git command failed'));

      const result = await getFileChangeCount('/test/dir', 5, {
        execGitLogFilenames: mockExecGitLogFilenames,
      });

      expect(result).toEqual({});
      expect(logger.trace).toHaveBeenCalledWith('Failed to get file change counts:', 'git command failed');
    });

    test('should handle empty git log output', async () => {
      const mockExecGitLogFilenames = vi.fn().mockResolvedValue([]);

      const result = await getFileChangeCount('/test/dir', 5, {
        execGitLogFilenames: mockExecGitLogFilenames,
      });

      expect(result).toEqual({});
      expect(mockExecGitLogFilenames).toHaveBeenCalledWith('/test/dir', 5);
    });
  });
});
