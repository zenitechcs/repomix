import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { timeout } from 'hono/timeout';
import { packAction } from './actions/packAction.js';
import { FILE_SIZE_LIMITS } from './constants.js';
import { cloudLogger, createErrorResponse, logInfo, logMemoryUsage } from './utils/logger.js';
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
app.use(
  '/*',
  cors({
    origin: (origin) => {
      const allowedOrigins = ['http://localhost:5173', 'https://repomix.com', 'https://api.repomix.com'];

      if (!origin || allowedOrigins.includes(origin)) {
        return origin;
      }

      if (origin.endsWith('.repomix.pages.dev')) {
        return origin;
      }

      return null;
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 86400,
    credentials: true,
  }),
);

// Enable compression
app.use(compress());

// Set timeout for API routes
app.use('/api', timeout(30000));

// Health check endpoint
app.get('/health', (c) => c.text('OK'));

// Main packing endpoint
app.post(
  '/api/pack',
  bodyLimit({
    maxSize: FILE_SIZE_LIMITS.MAX_REQUEST_SIZE,
    onError: (c) => {
      const requestId = c.get('requestId');
      const response = createErrorResponse('File size too large', requestId);
      return c.json(response, 413);
    },
  }),
  packAction,
);

// Start server
const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
logInfo(`Server starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

// Export app for testing
export default app;
