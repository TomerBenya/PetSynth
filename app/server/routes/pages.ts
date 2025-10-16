// Pages router - consolidates all web page routes
import { Hono } from 'hono';
import { requirePageAuth } from '../middleware/pageAuth.js';
import index from '../../web/pages/index.js';
import login from '../../web/pages/login.js';
import catalog from '../../web/pages/catalog.js';
import pet from '../../web/pages/pet/[id].js';
import generate from '../../web/pages/generate.js';
import store from '../../web/pages/store.js';

const pages = new Hono();

// Public routes (no authentication required)
pages.route('/login', login);

// Apply authentication middleware to all routes except /login and /js/*
pages.use('*', async (c, next) => {
  // Skip auth for login page and static files
  if (c.req.path === '/login' || c.req.path.startsWith('/login/') || c.req.path.startsWith('/js/')) {
    return next();
  }
  // Apply auth middleware for all other pages
  return requirePageAuth(c, next);
});

// Protected routes (authentication required)
pages.route('/', index);
pages.route('/catalog', catalog);
pages.route('/pet', pet);
pages.route('/generate', generate);
pages.route('/store', store);

export default pages;
