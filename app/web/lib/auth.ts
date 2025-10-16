// Client-side auth utilities

const TOKEN_KEY = 'pet_app_token';
const USERNAME_KEY = 'pet_app_username';

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set JWT token in localStorage
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Clear JWT token from localStorage
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Get username from localStorage
 */
export function getUsername(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USERNAME_KEY);
}

/**
 * Set username in localStorage
 */
export function setUsername(username: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERNAME_KEY, username);
}

/**
 * Clear username from localStorage
 */
export function clearUsername(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USERNAME_KEY);
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  return !!getToken();
}

/**
 * Logout user (clear token and username)
 */
export function logout(): void {
  clearToken();
  clearUsername();
}
