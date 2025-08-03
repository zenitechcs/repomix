import { describe, expect, it } from 'vitest';
import { buildCliConfig } from '../../../src/cli/actions/defaultAction.js';
import type { CliOptions } from '../../../src/cli/types.js';
import { RepomixError } from '../../../src/shared/errorHandle.js';

describe('buildCliConfig', () => {
  describe('tokenCountTree option', () => {
    it('should handle boolean tokenCountTree', () => {
      const options: CliOptions = {
        tokenCountTree: true,
      };

      const result = buildCliConfig(options);

      expect(result.output?.tokenCountTree).toBe(true);
    });

    it('should handle numeric tokenCountTree as string', () => {
      const options: CliOptions = {
        tokenCountTree: '100',
      };

      const result = buildCliConfig(options);

      expect(result.output?.tokenCountTree).toBe(100);
    });

    it('should parse string tokenCountTree to number', () => {
      const options: CliOptions = {
        tokenCountTree: '100',
      };

      const result = buildCliConfig(options);

      expect(result.output?.tokenCountTree).toBe(100);
    });

    it('should throw error for non-numeric string tokenCountTree', () => {
      const options: CliOptions = {
        tokenCountTree: 'invalid',
      };

      expect(() => buildCliConfig(options)).toThrow(RepomixError);
      expect(() => buildCliConfig(options)).toThrow(
        "Invalid token count threshold: 'invalid'. Must be a valid number.",
      );
    });

    it('should throw error for empty string tokenCountTree', () => {
      const options: CliOptions = {
        tokenCountTree: '',
      };

      expect(() => buildCliConfig(options)).toThrow(RepomixError);
      expect(() => buildCliConfig(options)).toThrow("Invalid token count threshold: ''. Must be a valid number.");
    });

    it('should handle tokenCountTree with leading/trailing spaces', () => {
      const options: CliOptions = {
        tokenCountTree: '  50  ',
      };

      const result = buildCliConfig(options);

      expect(result.output?.tokenCountTree).toBe(50);
    });

    it('should handle negative numbers in tokenCountTree', () => {
      const options: CliOptions = {
        tokenCountTree: '-10',
      };

      const result = buildCliConfig(options);

      expect(result.output?.tokenCountTree).toBe(-10);
    });

    it('should handle decimal numbers in tokenCountTree', () => {
      const options: CliOptions = {
        tokenCountTree: '10.5',
      };

      const result = buildCliConfig(options);

      // parseInt returns only the integer part
      expect(result.output?.tokenCountTree).toBe(10);
    });

    it('should handle mixed string like "100abc"', () => {
      const options: CliOptions = {
        tokenCountTree: '100abc',
      };

      const result = buildCliConfig(options);

      // parseInt parses until the first non-numeric character
      expect(result.output?.tokenCountTree).toBe(100);
    });

    it('should throw error for string starting with non-numeric character', () => {
      const options: CliOptions = {
        tokenCountTree: 'abc100',
      };

      expect(() => buildCliConfig(options)).toThrow(RepomixError);
      expect(() => buildCliConfig(options)).toThrow("Invalid token count threshold: 'abc100'. Must be a valid number.");
    });
  });
});
