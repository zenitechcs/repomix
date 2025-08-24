import type { Context, Next } from 'hono';
import { logger } from '../utils/logger.js';
import { formatMemoryUsage, getMemoryUsage } from '../utils/memory.js';
import { getClientIP } from '../utils/network.js';
import { calculateLatency } from '../utils/time.js';

// Augment Hono's context type
declare module 'hono' {
  interface ContextVariableMap {
    requestId: string;
  }
}

// Generate unique request identifier
function generateRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Main logging middleware for Hono
export function cloudLogger() {
  return async function loggerMiddleware(c: Context, next: Next) {
    const requestId = generateRequestId();
    const startTime = Date.now();

    // Add request ID to context for tracking
    c.set('requestId', requestId);

    // Collect basic request information
    const method = c.req.method;
    const url = new URL(c.req.url);
    const userAgent = c.req.header('user-agent');
    const referer = c.req.header('referer');
    const remoteIp = getClientIP(c);

    // Log request start
    logger.info({
      message: `${method} ${url.pathname} started`,
      requestId,
      httpRequest: {
        requestMethod: method,
        requestUrl: url.toString(),
        userAgent,
        referer,
        remoteIp,
      },
    });

    try {
      // Execute the request
      await next();

      // Calculate response time and memory usage
      const responseTime = calculateLatency(startTime);
      const memoryUsage = getMemoryUsage();

      // Log successful request completion
      logger.info({
        message: `${method} ${url.pathname} completed`,
        requestId,
        httpRequest: {
          requestMethod: method,
          requestUrl: url.toString(),
          status: c.res.status,
          responseSize: c.res.headers.get('content-length'),
          latency: responseTime,
          userAgent,
          referer,
          remoteIp,
        },
        memoryUsage: formatMemoryUsage(memoryUsage),
      });
    } catch (error) {
      // Calculate response time even for errors
      const responseTime = calculateLatency(startTime);
      const memoryUsage = getMemoryUsage();

      // Log error with context
      logger.error({
        message: `${method} ${url.pathname} failed`,
        requestId,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        },
        httpRequest: {
          requestMethod: method,
          requestUrl: url.toString(),
          latency: responseTime,
          userAgent,
          referer,
          remoteIp,
        },
        memoryUsage: formatMemoryUsage(memoryUsage),
      });

      // Re-throw the error to be handled by Hono's error handler
      throw error;
    }
  };
}
