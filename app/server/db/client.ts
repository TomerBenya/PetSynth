// Database client setup
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { resolve } from 'path';
import * as schema from './schema.js';

// Resolve database path
// import.meta.dir is app/server/db, so go up to app/ to find pets.db
const dbPath = resolve(import.meta.dir, '../../pets.db');

console.log('[DB] Resolved database path:', dbPath);

// Create SQLite database connection
// This will create the file if it doesn't exist
export const sqlite = new Database(dbPath, { create: true });

// Create Drizzle ORM instance with schema
export const db = drizzle(sqlite, { schema });
