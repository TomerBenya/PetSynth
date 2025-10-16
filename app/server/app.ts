import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env from project root (two directories up from server/app.ts)
dotenv.config({ path: resolve(import.meta.dir, '../../.env') });

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import auth from './routes/auth.js';
import pets from './routes/pets.js';
import generate from './routes/generate.js';
import store from './routes/store.js';
import pages from './routes/pages.js';

const app = new Hono();

// Request logging middleware
app.use('*', logger());

// CORS middleware - allow localhost
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8787'],
  credentials: true,
}));

// Mount API routes
app.route('/api/auth', auth);
app.route('/api/pets', pets);
app.route('/api/generate', generate);
app.route('/api/store', store);

// Serve static files from public directory
// When server runs from app/, path needs to be relative to app/
app.use('/js/*', serveStatic({
  root: './web/public',
  rewriteRequestPath: (path) => path.replace(/^\/js/, '/js')
}));
app.use('/images/*', serveStatic({
  root: './web/public',
  rewriteRequestPath: (path) => path.replace(/^\/images/, '/images')
}));

// Mount web pages router
app.route('/', pages);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ ok: true }, 200);
});

// Global error handler - catch all errors and return JSON
app.onError((err, c) => {
  console.error('Error:', err);

  const status = 'status' in err && typeof err.status === 'number' ? err.status : 500;
  const message = err.message || 'Internal Server Error';

  return c.json({ error: message }, status);
});

// 404 handler for unknown routes
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Start server
const PORT = Number(process.env.PORT) || 8787;

console.log(`Server starting on port ${PORT}...`);
console.log(`AI Text Provider: ${process.env.AI_TEXT_PROVIDER || 'not set (using mock)'}`);
console.log(`Image Provider: ${process.env.IMAGE_PROVIDER || 'not set (using placeholder)'}`);
console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'configured ✓' : 'not configured ✗'}`);

// Export for Bun/Cloudflare Workers
export default {
  port: PORT,
  fetch: app.fetch,
};
