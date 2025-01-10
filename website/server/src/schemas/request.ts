import { isValidRemoteValue } from 'repomix';
import { z } from 'zod';

// Regular expression to validate ignore patterns
// Allowed characters: alphanumeric, *, ?, /, -, _, ., space, comma
const ignorePatternRegex = /^[a-zA-Z0-9*?\/\-_., ]*$/;

export const packOptionsSchema = z
  .object({
    removeComments: z.boolean().optional(),
    removeEmptyLines: z.boolean().optional(),
    showLineNumbers: z.boolean().optional(),
    fileSummary: z.boolean().optional(),
    directoryStructure: z.boolean().optional(),
    includePatterns: z
      .string()
      .max(1000, 'Include patterns too long')
      .optional()
      .transform((val) => val?.trim()),
    ignorePatterns: z
      .string()
      .regex(ignorePatternRegex, 'Invalid characters in ignore patterns')
      .max(1000, 'Ignore patterns too long')
      .optional()
      .transform((val) => val?.trim()),
  })
  .strict();

export const packRequestSchema = z
  .object({
    url: z
      .string()
      .min(1, 'Repository URL is required')
      .max(200, 'Repository URL is too long')
      .transform((val) => val.trim())
      .refine((val) => isValidRemoteValue(val), { message: 'Invalid repository URL' }),
    format: z.enum(['xml', 'markdown', 'plain']),
    options: packOptionsSchema,
  })
  .strict();

export type PackRequest = z.infer<typeof packRequestSchema>;
