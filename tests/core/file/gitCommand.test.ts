import { beforeEach, describe, expect, test, vi } from 'vitest';
import { execGitShallowClone, isGitInstalled } from '../../../src/core/file/gitCommand.js';
import { logger } from '../../../src/shared/logger.js';

vi.mock('../../../src/shared/logger');

describe('gitCommand', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('isGitInstalled', () => {
    test('should return true when git is installed', async () => {
      const mockExecAsync = vi.fn().mockResolvedValue({ stdout: 'git version 2.34.1', stderr: '' });

      const result = await isGitInstalled({ execAsync: mockExecAsync });

      expect(result).toBe(true);
      expect(mockExecAsync).toHaveBeenCalledWith('git --version');
    });

    test('should return false when git command fails', async () => {
      const mockExecAsync = vi.fn().mockRejectedValue(new Error('Command not found: git'));

      const result = await isGitInstalled({ execAsync: mockExecAsync });

      expect(result).toBe(false);
      expect(mockExecAsync).toHaveBeenCalledWith('git --version');
      expect(logger.trace).toHaveBeenCalledWith('Git is not installed:', 'Command not found: git');
    });

    test('should return false when git command returns stderr', async () => {
      const mockExecAsync = vi.fn().mockResolvedValue({ stdout: '', stderr: 'git: command not found' });

      const result = await isGitInstalled({ execAsync: mockExecAsync });

      expect(result).toBe(false);
      expect(mockExecAsync).toHaveBeenCalledWith('git --version');
    });
  });

  describe('execGitShallowClone', () => {
    test('should execute without branch option if not specified by user', async () => {
      const mockExecAsync = vi.fn().mockResolvedValue({ stdout: '', stderr: '' });
      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const remoteBranch = undefined;

      await execGitShallowClone(url, directory, remoteBranch, { execAsync: mockExecAsync });

      expect(mockExecAsync).toHaveBeenCalledWith(`git clone --depth 1 ${url} ${directory}`);
    });
    test('should throw error when git clone fails', async () => {
      const mockExecAsync = vi.fn().mockRejectedValue(new Error('Authentication failed'));
      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const remoteBranch = undefined;

      await expect(execGitShallowClone(url, directory, remoteBranch, { execAsync: mockExecAsync })).rejects.toThrow(
        'Authentication failed',
      );

      expect(mockExecAsync).toHaveBeenCalledWith(`git clone --depth 1 ${url} ${directory}`);
    });
    test('should execute commands correctly when branch is specified', async () => {
      const mockExecAsync = vi.fn().mockResolvedValue({ stdout: '', stderr: '' });

      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const remoteBranch = 'main';

      await execGitShallowClone(url, directory, remoteBranch, { execAsync: mockExecAsync });

      expect(mockExecAsync).toHaveBeenCalledTimes(4);
      expect(mockExecAsync).toHaveBeenNthCalledWith(1, `git -C ${directory} init`);
      expect(mockExecAsync).toHaveBeenNthCalledWith(2, `git -C ${directory} remote add origin ${url}`);
      expect(mockExecAsync).toHaveBeenNthCalledWith(3, `git -C ${directory} fetch --depth 1 origin ${remoteBranch}`);
      expect(mockExecAsync).toHaveBeenNthCalledWith(4, `git -C ${directory} checkout FETCH_HEAD`);
    });

    test('should throw error when git fetch fails', async () => {
      const mockExecAsync = vi
        .fn()
        .mockResolvedValueOnce('Success on first call')
        .mockResolvedValueOnce('Success on second call')
        .mockRejectedValueOnce(new Error('Authentication failed'));

      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const remoteBranch = 'b188a6cb39b512a9c6da7235b880af42c78ccd0d';

      await expect(execGitShallowClone(url, directory, remoteBranch, { execAsync: mockExecAsync })).rejects.toThrow(
        'Authentication failed',
      );
      expect(mockExecAsync).toHaveBeenCalledTimes(3);
      expect(mockExecAsync).toHaveBeenNthCalledWith(1, `git -C ${directory} init`);
      expect(mockExecAsync).toHaveBeenNthCalledWith(2, `git -C ${directory} remote add origin ${url}`);
      expect(mockExecAsync).toHaveBeenLastCalledWith(`git -C ${directory} fetch --depth 1 origin ${remoteBranch}`);
      // The fourth call (e.g., git checkout) won't be made due to the error on the third call
    });

    test('should handle short SHA correctly', async () => {
      const mockExecAsync = vi.fn().mockResolvedValue({ stdout: '', stderr: '' });
      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const shortSha = 'ce9b621';

      await execGitShallowClone(url, directory, shortSha, { execAsync: mockExecAsync });

      expect(mockExecAsync).toHaveBeenCalledTimes(4);
      expect(mockExecAsync).toHaveBeenNthCalledWith(1, `git -C ${directory} init`);
      expect(mockExecAsync).toHaveBeenNthCalledWith(2, `git -C ${directory} remote add origin ${url}`);
      expect(mockExecAsync).toHaveBeenNthCalledWith(3, `git -C ${directory} fetch origin`);
      expect(mockExecAsync).toHaveBeenNthCalledWith(4, `git -C ${directory} checkout ${shortSha}`);
    });
  });
});
