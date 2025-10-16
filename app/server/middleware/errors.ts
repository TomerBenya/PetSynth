// Error handling middleware
import { Context } from 'hono';

/**
 * Custom error class with HTTP status code
 */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Error handler function
 * Returns JSON error response with appropriate status code
 * @param c - Hono context
 * @param error - Error object
 * @param status - HTTP status code (default: 500)
 */
export function handle(c: Context, error: Error | HttpError, status?: number): Response {
  // If error is HttpError, use its status code
  if (error instanceof HttpError) {
    return c.json({ error: error.message }, error.status);
  }

  // Otherwise use provided status or default to 500
  const statusCode = status || 500;
  const message = error.message || 'Internal Server Error';

  return c.json({ error: message }, statusCode);
}

/**
 * Helper functions to create common HTTP errors
 */
export const errors = {
  badRequest: (message: string = 'Bad Request') => new HttpError(400, message),
  unauthorized: (message: string = 'Unauthorized') => new HttpError(401, message),
  forbidden: (message: string = 'Forbidden') => new HttpError(403, message),
  notFound: (message: string = 'Not Found') => new HttpError(404, message),
  conflict: (message: string = 'Conflict') => new HttpError(409, message),
  unprocessable: (message: string = 'Unprocessable Entity') => new HttpError(422, message),
  internal: (message: string = 'Internal Server Error') => new HttpError(500, message),
};
