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
          'Condense code by removing non-essential whitespace and comments to optimize token usage (default: true)',
        ),
      includePatterns: z.string().optional().describe('List of include patterns (comma-separated)'),
      ignorePatterns: z.string().optional().describe('Additional ignore patterns (comma-separated)'),
    },
    async ({ remote, includePatterns, ignorePatterns, compress }): Promise<CallToolResult> => {
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
          topFilesLen: 0,
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

        return {
          content: [
            {
              type: 'text',
              text: 'Successfully packed repository!',
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
              text: `Error packing repository: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    },
  );
};
