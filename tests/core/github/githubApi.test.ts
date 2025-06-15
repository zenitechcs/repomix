import { describe, expect, test } from 'vitest';
import {
  buildGitHubArchiveUrl,
  buildGitHubTagArchiveUrl,
  checkGitHubResponse,
  getArchiveFilename,
  isGitHubUrl,
  parseGitHubUrl,
} from '../../../src/core/github/githubApi.js';
import { RepomixError } from '../../../src/shared/errorHandle.js';

describe('githubApi', () => {
  describe('parseGitHubUrl', () => {
    test('should parse shorthand format', () => {
      const result = parseGitHubUrl('yamadashy/repomix');
      expect(result).toEqual({
        owner: 'yamadashy',
        repo: 'repomix',
      });
    });

    test('should parse full GitHub URL', () => {
      const result = parseGitHubUrl('https://github.com/yamadashy/repomix');
      expect(result).toEqual({
        owner: 'yamadashy',
        repo: 'repomix',
      });
    });

    test('should parse GitHub URL with .git suffix', () => {
      const result = parseGitHubUrl('https://github.com/yamadashy/repomix.git');
      expect(result).toEqual({
        owner: 'yamadashy',
        repo: 'repomix',
      });
    });

    test('should parse GitHub URL with branch', () => {
      const result = parseGitHubUrl('https://github.com/yamadashy/repomix/tree/develop');
      expect(result).toEqual({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'develop',
      });
    });

    test('should parse GitHub URL with nested branch', () => {
      const result = parseGitHubUrl('https://github.com/yamadashy/repomix/tree/feature/new-feature');
      expect(result).toEqual({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'feature/new-feature',
      });
    });

    test('should parse GitHub URL with commit', () => {
      const result = parseGitHubUrl('https://github.com/yamadashy/repomix/commit/abc123def456');
      expect(result).toEqual({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'abc123def456',
      });
    });

    test('should parse git@ SSH URLs', () => {
      const result = parseGitHubUrl('git@github.com:yamadashy/repomix.git');
      expect(result).toEqual({
        owner: 'yamadashy',
        repo: 'repomix',
      });
    });

    test('should parse git@ SSH URLs without .git suffix', () => {
      const result = parseGitHubUrl('git@github.com:yamadashy/repomix');
      expect(result).toEqual({
        owner: 'yamadashy',
        repo: 'repomix',
      });
    });

    test('should return null for non-GitHub URLs', () => {
      const result = parseGitHubUrl('https://gitlab.com/user/repo');
      expect(result).toBeNull();
    });

    test('should return null for invalid shorthand', () => {
      const result = parseGitHubUrl('invalid-shorthand');
      expect(result).toBeNull();
    });

    test('should return null for malformed URLs', () => {
      const result = parseGitHubUrl('not-a-url');
      expect(result).toBeNull();
    });
  });

  describe('buildGitHubArchiveUrl', () => {
    test('should build URL with default main branch', () => {
      const url = buildGitHubArchiveUrl({
        owner: 'yamadashy',
        repo: 'repomix',
      });
      expect(url).toBe('https://github.com/yamadashy/repomix/archive/refs/heads/main.zip');
    });

    test('should build URL with specific branch', () => {
      const url = buildGitHubArchiveUrl({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'develop',
      });
      expect(url).toBe('https://github.com/yamadashy/repomix/archive/refs/heads/develop.zip');
    });

    test('should build URL with commit SHA', () => {
      const url = buildGitHubArchiveUrl({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'abc123def456',
      });
      expect(url).toBe('https://github.com/yamadashy/repomix/archive/abc123def456.zip');
    });

    test('should build URL with short commit SHA', () => {
      const url = buildGitHubArchiveUrl({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'abc123',
      });
      expect(url).toBe('https://github.com/yamadashy/repomix/archive/abc123.zip');
    });
  });

  describe('buildGitHubTagArchiveUrl', () => {
    test('should build tag archive URL', () => {
      const url = buildGitHubTagArchiveUrl({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'v1.0.0',
      });
      expect(url).toBe('https://github.com/yamadashy/repomix/archive/refs/tags/v1.0.0.zip');
    });

    test('should return null for commit SHA', () => {
      const url = buildGitHubTagArchiveUrl({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'abc123def456',
      });
      expect(url).toBeNull();
    });

    test('should return null when no ref provided', () => {
      const url = buildGitHubTagArchiveUrl({
        owner: 'yamadashy',
        repo: 'repomix',
      });
      expect(url).toBeNull();
    });
  });

  describe('isGitHubUrl', () => {
    test('should return true for valid GitHub URLs', () => {
      expect(isGitHubUrl('yamadashy/repomix')).toBe(true);
      expect(isGitHubUrl('https://github.com/yamadashy/repomix')).toBe(true);
      expect(isGitHubUrl('https://github.com/yamadashy/repomix.git')).toBe(true);
      expect(isGitHubUrl('git@github.com:yamadashy/repomix.git')).toBe(true);
    });

    test('should return false for non-GitHub URLs', () => {
      expect(isGitHubUrl('https://gitlab.com/user/repo')).toBe(false);
      expect(isGitHubUrl('invalid-url')).toBe(false);
    });
  });

  describe('getArchiveFilename', () => {
    test('should generate filename with default main branch', () => {
      const filename = getArchiveFilename({
        owner: 'yamadashy',
        repo: 'repomix',
      });
      expect(filename).toBe('repomix-main.zip');
    });

    test('should generate filename with specific branch', () => {
      const filename = getArchiveFilename({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'develop',
      });
      expect(filename).toBe('repomix-develop.zip');
    });

    test('should generate filename with nested branch', () => {
      const filename = getArchiveFilename({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'feature/new-feature',
      });
      expect(filename).toBe('repomix-new-feature.zip');
    });

    test('should generate filename with commit SHA', () => {
      const filename = getArchiveFilename({
        owner: 'yamadashy',
        repo: 'repomix',
        ref: 'abc123def456',
      });
      expect(filename).toBe('repomix-abc123def456.zip');
    });
  });

  describe('checkGitHubResponse', () => {
    test('should not throw for successful response', () => {
      const response = new Response('', { status: 200 });
      expect(() => checkGitHubResponse(response)).not.toThrow();
    });

    test('should throw RepomixError for 404 response', () => {
      const response = new Response('', { status: 404 });
      expect(() => checkGitHubResponse(response)).toThrow(RepomixError);
      expect(() => checkGitHubResponse(response)).toThrow('Repository not found or is private');
    });

    test('should throw RepomixError for rate limit (403 with rate limit headers)', () => {
      const headers = new Headers({
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': '1234567890',
      });
      const response = new Response('', { status: 403, headers });
      expect(() => checkGitHubResponse(response)).toThrow(RepomixError);
      expect(() => checkGitHubResponse(response)).toThrow('GitHub API rate limit exceeded');
    });

    test('should throw RepomixError for other 403 responses', () => {
      const response = new Response('', { status: 403 });
      expect(() => checkGitHubResponse(response)).toThrow(RepomixError);
      expect(() => checkGitHubResponse(response)).toThrow('Access denied');
    });

    test('should throw RepomixError for server errors', () => {
      const response = new Response('', { status: 500 });
      expect(() => checkGitHubResponse(response)).toThrow(RepomixError);
      expect(() => checkGitHubResponse(response)).toThrow('GitHub server error');
    });

    test('should throw RepomixError for other error responses', () => {
      const response = new Response('', { status: 400 });
      expect(() => checkGitHubResponse(response)).toThrow(RepomixError);
      expect(() => checkGitHubResponse(response)).toThrow('GitHub API error: 400');
    });
  });
});
