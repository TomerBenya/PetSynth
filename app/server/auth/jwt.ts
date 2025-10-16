// JWT token utilities
import { SignJWT, jwtVerify } from 'jose';

// Get JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

// Convert secret to Uint8Array for jose
const getSecretKey = () => new TextEncoder().encode(JWT_SECRET);

// JWT payload interface
export interface JwtPayload {
  sub: string; // user ID
  username: string;
}

/**
 * Sign a JWT token
 * @param payload - Object containing sub (user ID) and username
 * @param expSec - Expiration time in seconds (default: 86400 = 24 hours)
 * @returns Signed JWT token string
 */
export async function signJwt(
  payload: JwtPayload,
  expSec: number = 86400
): Promise<string> {
  const token = await new SignJWT({
    sub: payload.sub,
    username: payload.username,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expSec}s`)
    .sign(getSecretKey());

  return token;
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string to verify
 * @returns Decoded payload or null if verification fails
 */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    });

    // Ensure required fields are present
    if (!payload.sub || typeof payload.sub !== 'string') {
      return null;
    }

    if (!payload.username || typeof payload.username !== 'string') {
      return null;
    }

    return {
      sub: payload.sub,
      username: payload.username,
    };
  } catch (error) {
    // Token is invalid, expired, or malformed
    return null;
  }
}
