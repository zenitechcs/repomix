import type { Context, Next } from 'hono';
import { rateLimiter } from '../domains/pack/utils/sharedInstance.js';
import { getClientInfo } from '../utils/clientInfo.js';

export function rateLimitMiddleware() {
  return async function rateLimitMiddleware(c: Context, next: Next) {
    const clientInfo = getClientInfo(c);

    // Check rate limit
    if (!rateLimiter.isAllowed(clientInfo.ip)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(clientInfo.ip) / 1000);
      return c.json(
        {
          error: `Rate limit exceeded. Please try again in ${remainingTime} seconds.`,
        },
        429,
      );
    }

    await next();
  };
}
