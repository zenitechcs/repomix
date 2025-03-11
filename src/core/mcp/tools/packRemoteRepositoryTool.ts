import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { runCli } from '../../../cli/cliRun.js';
import type { CliOptions } from '../../../cli/types.js';
import { logger } from '../../../shared/logger.js';

export const registerPackRemoteRepositoryTool = (mcpServer: McpServer) => {
  mcpServer.tool(
    'pack_remote_repository',
    'Fetch, clone and package a GitHub repository into a consolidated file for AI analysis',
    {
      remote: z.string().describe('GitHub repository URL or user/repo (e.g., yamadashy/repomix)'),
      compress: z
        .boolean()
        .default(true)
        .describe(
          'Utilize Tree-sitter to intelligently extract essential code signatures and structure while removing implementation details, significantly reducing token usage (default: true)',
        ),
      includePatterns: z
        .string()
        .optional()
        .describe(
          'Specify which files to include using fast-glob compatible patterns (e.g., "**/*.js,src/**"). Only files matching these patterns will be processed',
        ),
      ignorePatterns: z
        .string()
        .optional()
        .describe(
          'Specify additional files to exclude using fast-glob compatible patterns (e.g., "test/**,*.spec.js"). These patterns complement .gitignore and default ignores',
        ),
      topFilesLength: z
        .number()
        .optional()
        .default(5)
        .describe('Number of top files to display in the metrics (default: 5)'),
    },
    async ({ remote, compress, includePatterns, ignorePatterns, topFilesLength }): Promise<CallToolResult> => {
      try {
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repomix-'));
        const outputFilePath = path.join(tempDir, 'output.txt');

        const cliOptions = {
          remote,
          compress,
          include: includePatterns,
          ignore: ignorePatterns,
          output: outputFilePath,
          style: 'xml',
          securityCheck: true,
          topFilesLen: topFilesLength,
          quiet: true,
        } as CliOptions;

        const result = await runCli(['.'], process.cwd(), cliOptions);
        if (!result) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: 'Failed to return a result',
              },
            ],
          };
        }

        // Extract metrics information from the pack result
        const { packResult } = result;
        const { totalFiles, totalCharacters, totalTokens, fileCharCounts, fileTokenCounts } = packResult;

        // Get top files by character count
        const topFiles = Object.entries(fileCharCounts)
          .map(([filePath, charCount]) => ({
            path: filePath,
            charCount,
            tokenCount: fileTokenCounts[filePath] || 0,
          }))
          .sort((a, b) => b.charCount - a.charCount)
          .slice(0, cliOptions.topFilesLen);

        // Create JSON string with all the metrics information
        const jsonResult = JSON.stringify(
          {
            repository: remote,
            metrics: {
              totalFiles,
              totalCharacters,
              totalTokens,
              topFiles,
            },
          },
          null,
          2,
        );

        return {
          content: [
            {
              type: 'text',
              text: '🎉 Successfully packed codebase!\nPlease review the metrics below and consider adjusting compress/includePatterns/ignorePatterns if the token count is too high and you need to reduce it before reading the file content.',
            },
            {
              type: 'text',
              text: jsonResult,
            },
            {
              type: 'resource',
              resource: {
                text: 'Repomix output file',
                uri: `file://${outputFilePath}`,
                mimeType: 'text/plain',
              },
            },
          ],
        };
      } catch (error) {
        logger.error(`Error packing repository: ${error instanceof Error ? error.message : String(error)}`);
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: false,
                  error: error instanceof Error ? error.message : String(error),
                },
                null,
                2,
              ),
            },
          ],
        };
      }
    },
  );
};
