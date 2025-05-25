import fs from 'node:fs/promises';
import path from 'node:path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { logger } from '../../shared/logger.js';
import { buildMcpToolErrorResponse, buildMcpToolSuccessResponse } from './mcpToolRuntime.js';

/**
 * Register file system directory listing tool
 */
export const registerFileSystemReadDirectoryTool = (mcpServer: McpServer) => {
  mcpServer.tool(
    'file_system_read_directory',
    'List the contents of a directory using an absolute path. Returns a formatted list showing files and subdirectories with clear [FILE]/[DIR] indicators. Useful for exploring project structure and understanding codebase organization.',
    {
      path: z.string().describe('Absolute path to the directory to list'),
    },
    {
      title: 'Read Directory',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async ({ path: directoryPath }): Promise<CallToolResult> => {
      try {
        logger.trace(`Listing directory at absolute path: ${directoryPath}`);

        // Ensure path is absolute
        if (!path.isAbsolute(directoryPath)) {
          return buildMcpToolErrorResponse([`Error: Path must be absolute. Received: ${directoryPath}`]);
        }

        // Check if directory exists
        try {
          const stats = await fs.stat(directoryPath);
          if (!stats.isDirectory()) {
            return buildMcpToolErrorResponse([
              `Error: The specified path is not a directory: ${directoryPath}. Use file_system_read_file for files.`,
            ]);
          }
        } catch {
          return buildMcpToolErrorResponse([`Error: Directory not found at path: ${directoryPath}`]);
        }

        // Read directory contents
        const entries = await fs.readdir(directoryPath, { withFileTypes: true });
        const formatted = entries
          .map((entry) => `${entry.isDirectory() ? '[DIR]' : '[FILE]'} ${entry.name}`)
          .join('\n');

        return buildMcpToolSuccessResponse([`Contents of ${directoryPath}:`, formatted || '(empty directory)']);
      } catch (error) {
        logger.error(`Error in file_system_read_directory tool: ${error}`);
        return buildMcpToolErrorResponse([
          `Error listing directory: ${error instanceof Error ? error.message : String(error)}`,
        ]);
      }
    },
  );
};
