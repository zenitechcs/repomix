import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { unzip } from 'fflate';
import { FILE_SIZE_LIMITS, formatFileSize } from '../constants.js';
import { AppError } from './errorHandler.js';

export async function extractZip(file: File, destPath: string): Promise<void> {
  try {
    // Validate file size before processing
    if (file.size > FILE_SIZE_LIMITS.MAX_ZIP_SIZE) {
      throw new AppError(`File size exceeds maximum limit of ${formatFileSize(FILE_SIZE_LIMITS.MAX_ZIP_SIZE)}`);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Unzip using fflate with promise wrapper
    const files = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
      unzip(buffer, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const filePaths = Object.keys(files);

    // Validate number of files
    if (filePaths.length > FILE_SIZE_LIMITS.MAX_FILES) {
      throw new AppError(
        `ZIP contains too many files (${filePaths.length}). Maximum allowed: ${FILE_SIZE_LIMITS.MAX_FILES}`,
      );
    }

    // Validate total uncompressed size
    const totalUncompressedSize = Object.values(files).reduce((sum, data) => sum + data.length, 0);
    if (totalUncompressedSize > FILE_SIZE_LIMITS.MAX_UNCOMPRESSED_SIZE) {
      throw new AppError(
        `Uncompressed size exceeds maximum limit of ${formatFileSize(FILE_SIZE_LIMITS.MAX_UNCOMPRESSED_SIZE)}`,
      );
    }

    // Check for unsafe paths (directory traversal prevention)
    for (const entryPath of filePaths) {
      const fullPath = path.join(destPath, entryPath);
      if (!fullPath.startsWith(destPath)) {
        throw new AppError('ZIP contains unsafe file paths');
      }
    }

    await fs.mkdir(destPath, { recursive: true });

    // Extract files using fflate
    for (const [filePath, data] of Object.entries(files)) {
      if (filePath.endsWith('/')) continue; // Skip directories

      const fullPath = path.join(destPath, filePath);
      const dirPath = path.dirname(fullPath);

      // Create directory if it doesn't exist
      await fs.mkdir(dirPath, { recursive: true });

      // Write the file
      await fs.writeFile(fullPath, data);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Failed to extract ZIP file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const createTempDirectory = async (): Promise<string> => {
  try {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repomix-'));
    return tempDir;
  } catch (error) {
    throw new AppError(`Failed to create temporary directory: ${(error as Error).message}`);
  }
};

export const cleanupTempDirectory = async (directory: string): Promise<void> => {
  try {
    if (!directory.includes('repomix-')) {
      throw new AppError('Invalid temporary directory path');
    }
    await fs.rm(directory, { recursive: true, force: true });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error(`Failed to cleanup temporary directory: ${directory}`, error);
  }
};

export const copyOutputToCurrentDirectory = async (
  sourceDir: string,
  targetDir: string,
  outputFileName: string,
): Promise<void> => {
  // Sanitize file paths
  const sanitizedFileName = path.basename(outputFileName);
  const sourcePath = path.join(sourceDir, sanitizedFileName);
  const targetPath = path.join(targetDir, sanitizedFileName);

  try {
    // Verify source exists
    await fs.access(sourcePath);

    // Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true });

    await fs.copyFile(sourcePath, targetPath);
  } catch (error) {
    throw new AppError(
      `Failed to copy output file: ${(error as Error).message}. Source: ${sourcePath}, Target: ${targetPath}`,
    );
  }
};
