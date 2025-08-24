import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { timeout } from 'hono/timeout';
import { packAction } from './actions/packAction.js';
import { bodyLimitMiddleware } from './middlewares/bodyLimit.js';
import { corsMiddleware } from './middlewares/cors.js';
import { cloudLogger } from './middlewares/logger.js';
import { logInfo, logMemoryUsage } from './utils/logger.js';
import { getProcessConcurrency } from './utils/processConcurrency.js';

// Log server metrics on startup
logInfo('Server starting', {
  metrics: {
    processConcurrency: getProcessConcurrency(),
  },
});

// Log initial memory usage
logMemoryUsage('Server startup', {
  processConcurrency: getProcessConcurrency(),
});

const app = new Hono();

// Setup custom logger
app.use('*', cloudLogger());

// Configure CORS
app.use('/*', corsMiddleware);

// Enable compression
app.use(compress());

// Set timeout for API routes
app.use('/api', timeout(30000));

// Health check endpoint
app.get('/health', (c) => c.text('OK'));

// Main packing endpoint
app.post('/api/pack', bodyLimitMiddleware, packAction);

// Start server
const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
logInfo(`Server starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

// Export app for testing
export default app;
