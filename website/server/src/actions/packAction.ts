import type { Context } from 'hono';
import { processZipFile } from '../domains/pack/processZipFile.js';
import { processRemoteRepo } from '../domains/pack/remoteRepo.js';
import type { PackResult } from '../types.js';
import { createErrorResponse, logError, logInfo, logMemoryUsage } from '../utils/logger.js';
import { formatLatencyForDisplay } from '../utils/time.js';

export const packAction = async (c: Context) => {
  try {
    const formData = await c.req.formData();
    const requestId = c.get('requestId');

    // Get form data
    const format = formData.get('format') as 'xml' | 'markdown' | 'plain';
    const options = JSON.parse(formData.get('options') as string);
    const file = formData.get('file') as File | null;
    const url = formData.get('url') as string | null;

    // Validate input
    if (!file && !url) {
      return c.json(createErrorResponse('Either repository URL or file is required', requestId), 400);
    }

    if (!['xml', 'markdown', 'plain'].includes(format)) {
      return c.json(createErrorResponse('Invalid format specified', requestId), 400);
    }

    // Get client IP
    const clientIp =
      c.req.header('x-forwarded-for')?.split(',')[0] ||
      c.req.header('x-real-ip') ||
      c.req.header('cf-connecting-ip') ||
      '0.0.0.0';

    const startTime = Date.now();

    // Process file or repository
    let result: PackResult;
    if (file) {
      result = await processZipFile(file, format, options, clientIp);
    } else {
      if (!url) {
        return c.json(createErrorResponse('Repository URL is required', requestId), 400);
      }
      result = await processRemoteRepo(url, format, options, clientIp);
    }

    // Log operation result with memory usage
    logInfo('Pack operation completed', {
      requestId,
      format,
      repository: result.metadata.repository,
      duration: formatLatencyForDisplay(startTime),
      inputType: file ? 'file' : url ? 'url' : 'unknown',
      metrics: {
        totalFiles: result.metadata.summary?.totalFiles,
        totalCharacters: result.metadata.summary?.totalCharacters,
        totalTokens: result.metadata.summary?.totalTokens,
      },
    });

    // Log memory usage after processing
    logMemoryUsage('Pack operation memory usage', {
      requestId,
      repository: result.metadata.repository,
      totalFiles: result.metadata.summary?.totalFiles,
      totalCharacters: result.metadata.summary?.totalCharacters,
    });

    return c.json(result);
  } catch (error) {
    // Handle errors
    logError('Pack operation failed', error instanceof Error ? error : new Error('Unknown error'), {
      requestId: c.get('requestId'),
    });

    const { handlePackError } = await import('../utils/errorHandler.js');
    const appError = handlePackError(error);
    return c.json(createErrorResponse(appError.message, c.get('requestId')), appError.statusCode);
  }
};
