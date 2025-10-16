// Authentication middleware
import { Context, Next } from 'hono';
import { verifyJwt } from '../auth/jwt.js';

// User type that will be attached to context
export interface User {
  id: string;
  username: string;
}

/**
 * Middleware to require authenticated user
 * Reads Authorization: Bearer <token>, verifies it, and attaches user to context
 * Returns 401 JSON error if authentication fails
 */
export async function requireUser(c: Context, next: Next) {
  // Get Authorization header
  const authHeader = c.req.header('Authorization');

  if (!authHeader) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  // Check if it's a Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized - Invalid token format' }, 401);
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.slice(7);

  if (!token) {
    return c.json({ error: 'Unauthorized - Token is empty' }, 401);
  }

  // Verify token
  const payload = await verifyJwt(token);

  if (!payload) {
    return c.json({ error: 'Unauthorized - Invalid or expired token' }, 401);
  }

  // Attach user to context
  c.set('user', {
    id: payload.sub,
    username: payload.username,
  });

  // Continue to next middleware/handler
  await next();
}
