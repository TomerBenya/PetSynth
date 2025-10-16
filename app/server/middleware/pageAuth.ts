// Page authentication middleware - redirects to login instead of returning JSON
import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyJwt } from '../auth/jwt.js';

/**
 * Middleware for page routes that require authentication
 * Checks for JWT in cookie or Authorization header
 * Redirects to /login if authentication fails (instead of returning JSON)
 */
export async function requirePageAuth(c: Context, next: Next) {
  // Try to get token from Authorization header first (for API-like requests)
  let token = c.req.header('Authorization')?.replace('Bearer ', '');

  // If no Authorization header, try to get from cookie
  if (!token) {
    token = getCookie(c, 'auth_token');
  }

  // If still no token, redirect to login
  if (!token) {
    return c.redirect('/login');
  }

  // Verify token
  const payload = await verifyJwt(token);

  if (!payload) {
    // Token is invalid or expired, redirect to login
    return c.redirect('/login');
  }

  // Attach user to context for use in page handlers
  c.set('user', {
    id: payload.sub,
    username: payload.username,
  });

  // Continue to next middleware/handler
  await next();
}
