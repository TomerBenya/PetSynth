// Authentication routes
import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { signJwt } from '../auth/jwt.js';
import { requireUser, User } from '../middleware/auth.js';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { RegisterZ, LoginZ } from '../validation/auth.js';
import { handle, errors } from '../middleware/errors.js';

// Define context variables type
type Variables = {
  user: User;
};

const auth = new Hono<{ Variables: Variables }>();

const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Register a new user
 */
auth.post('/register', async (c) => {
  try {
    // Parse and validate request body
    const body = await c.req.json();
    const parsed = RegisterZ.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: 'Invalid input', details: parsed.error.issues }, 400);
    }

    const { username, password } = parsed.data;

    // Check if username already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();

    if (existingUser) {
      return c.json({ error: 'Username already taken' }, 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const userId = nanoid();
    await db.insert(users).values({
      id: userId,
      username,
      passwordHash,
      createdAt: Date.now(),
    });

    // Sign JWT
    const token = await signJwt({ sub: userId, username });

    // Set auth cookie for page authentication
    c.header('Set-Cookie', `auth_token=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`);

    // Return token and user
    return c.json({
      token,
      user: {
        id: userId,
        username,
      },
    }, 201);
  } catch (error) {
    return handle(c, error instanceof Error ? error : new Error('Registration failed'));
  }
});

/**
 * POST /api/auth/login
 * Login with existing credentials
 */
auth.post('/login', async (c) => {
  try {
    // Parse and validate request body
    const body = await c.req.json();
    const parsed = LoginZ.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: 'Invalid input', details: parsed.error.issues }, 400);
    }

    const { username, password } = parsed.data;

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .get();

    if (!user || !user.passwordHash) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Sign JWT
    const token = await signJwt({ sub: user.id, username: user.username });

    // Set auth cookie for page authentication
    c.header('Set-Cookie', `auth_token=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`);

    // Return token and user
    return c.json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    return handle(c, error instanceof Error ? error : new Error('Login failed'));
  }
});

/**
 * GET /api/auth/me
 * Get current user profile (requires Bearer token)
 */
auth.get('/me', requireUser, async (c) => {
  const user = c.get('user');
  return c.json({
    id: user.id,
    username: user.username,
  });
});

export default auth;
