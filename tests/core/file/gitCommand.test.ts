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
      const mockFileExecAsync = vi.fn().mockResolvedValue({ stdout: 'git version 2.34.1', stderr: '' });

      const result = await isGitInstalled({ execFileAsync: mockFileExecAsync });

      expect(result).toBe(true);
      expect(mockFileExecAsync).toHaveBeenCalledWith('git', ['--version']);
    });

    test('should return false when git command fails', async () => {
      const mockFileExecAsync = vi.fn().mockRejectedValue(new Error('Command not found: git'));

      const result = await isGitInstalled({ execFileAsync: mockFileExecAsync });

      expect(result).toBe(false);
      expect(mockFileExecAsync).toHaveBeenCalledWith('git', ['--version']);
      expect(logger.trace).toHaveBeenCalledWith('Git is not installed:', 'Command not found: git');
    });

    test('should return false when git command returns stderr', async () => {
      const mockFileExecAsync = vi.fn().mockResolvedValue({ stdout: '', stderr: 'git: command not found' });

      const result = await isGitInstalled({ execFileAsync: mockFileExecAsync });

      expect(result).toBe(false);
      expect(mockFileExecAsync).toHaveBeenCalledWith('git', ['--version']);
    });
  });

  describe('execGitShallowClone', () => {
    test('should execute without branch option if not specified by user', async () => {
      const mockFileExecAsync = vi.fn().mockResolvedValue({ stdout: '', stderr: '' });
      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const remoteBranch = undefined;

      await execGitShallowClone(url, directory, remoteBranch, { execFileAsync: mockFileExecAsync });

      expect(mockFileExecAsync).toHaveBeenCalledWith('git', ['clone', '--depth', '1', url, directory]);
    });

    test('should throw error when git clone fails', async () => {
      const mockFileExecAsync = vi.fn().mockRejectedValue(new Error('Authentication failed'));
      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const remoteBranch = undefined;

      await expect(
        execGitShallowClone(url, directory, remoteBranch, { execFileAsync: mockFileExecAsync }),
      ).rejects.toThrow('Authentication failed');

      expect(mockFileExecAsync).toHaveBeenCalledWith('git', ['clone', '--depth', '1', url, directory]);
    });

    test('should execute commands correctly when branch is specified', async () => {
      const mockFileExecAsync = vi.fn().mockResolvedValue({ stdout: '', stderr: '' });

      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const remoteBranch = 'main';

      await execGitShallowClone(url, directory, remoteBranch, { execFileAsync: mockFileExecAsync });

      expect(mockFileExecAsync).toHaveBeenCalledTimes(4);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(1, 'git', ['-C', directory, 'init']);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(2, 'git', ['-C', directory, 'remote', 'add', 'origin', url]);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(3, 'git', [
        '-C',
        directory,
        'fetch',
        '--depth',
        '1',
        'origin',
        remoteBranch,
      ]);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(4, 'git', ['-C', directory, 'checkout', 'FETCH_HEAD']);
    });

    test('should throw error when git fetch fails', async () => {
      const mockFileExecAsync = vi
        .fn()
        .mockResolvedValueOnce('Success on first call')
        .mockResolvedValueOnce('Success on second call')
        .mockRejectedValueOnce(new Error('Authentication failed'));

      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const remoteBranch = 'b188a6cb39b512a9c6da7235b880af42c78ccd0d';

      await expect(
        execGitShallowClone(url, directory, remoteBranch, { execFileAsync: mockFileExecAsync }),
      ).rejects.toThrow('Authentication failed');
      expect(mockFileExecAsync).toHaveBeenCalledTimes(3);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(1, 'git', ['-C', directory, 'init']);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(2, 'git', ['-C', directory, 'remote', 'add', 'origin', url]);
      expect(mockFileExecAsync).toHaveBeenLastCalledWith('git', [
        '-C',
        directory,
        'fetch',
        '--depth',
        '1',
        'origin',
        remoteBranch,
      ]);
    });

    test('should handle short SHA correctly', async () => {
      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const shortSha = 'ce9b621';
      const mockFileExecAsync = vi
        .fn()
        .mockResolvedValueOnce('Success on first call')
        .mockResolvedValueOnce('Success on second call')
        .mockRejectedValueOnce(
          new Error(
            `Command failed: git fetch --depth 1 origin ${shortSha}\nfatal: couldn't find remote ref ${shortSha}`,
          ),
        );

      await execGitShallowClone(url, directory, shortSha, { execFileAsync: mockFileExecAsync });

      expect(mockFileExecAsync).toHaveBeenCalledTimes(5);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(1, 'git', ['-C', directory, 'init']);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(2, 'git', ['-C', directory, 'remote', 'add', 'origin', url]);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(3, 'git', [
        '-C',
        directory,
        'fetch',
        '--depth',
        '1',
        'origin',
        shortSha,
      ]);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(4, 'git', ['-C', directory, 'fetch', 'origin']);
      expect(mockFileExecAsync).toHaveBeenLastCalledWith('git', ['-C', directory, 'checkout', shortSha]);
    });

    test("should throw error when remote ref is not found, and it's not due to short SHA", async () => {
      const url = 'https://github.com/user/repo.git';
      const directory = '/tmp/repo';
      const remoteBranch = 'b188a6cb39b512a9c6da7235b880af42c78ccd0d';
      const errMessage = `Command failed: git fetch --depth 1 origin ${remoteBranch}\nfatal: couldn't find remote ref ${remoteBranch}`;

      const mockFileExecAsync = vi
        .fn()
        .mockResolvedValueOnce('Success on first call')
        .mockResolvedValueOnce('Success on second call')
        .mockRejectedValueOnce(new Error(errMessage));

      await expect(
        execGitShallowClone(url, directory, remoteBranch, { execFileAsync: mockFileExecAsync }),
      ).rejects.toThrow(errMessage);
      expect(mockFileExecAsync).toHaveBeenCalledTimes(3);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(1, 'git', ['-C', directory, 'init']);
      expect(mockFileExecAsync).toHaveBeenNthCalledWith(2, 'git', ['-C', directory, 'remote', 'add', 'origin', url]);
      expect(mockFileExecAsync).toHaveBeenLastCalledWith('git', [
        '-C',
        directory,
        'fetch',
        '--depth',
        '1',
        'origin',
        remoteBranch,
      ]);
    });
  });
});
