// Database schema definitions
import { sqliteTable, text, integer, real, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash'),
  createdAt: integer('created_at', { mode: 'number' })
    .notNull()
    .default(sql`(cast(unixepoch('now', 'subsec') * 1000 as integer))`),
});

// Pets table
export const pets = sqliteTable('pets', {
  id: text('id').primaryKey(),
  name: text('name'),
  species: text('species'),
  traitsJson: text('traits_json'),
  description: text('description'),
  careInstructions: text('care_instructions'),
  priceCents: integer('price_cents'),
  imageUrl: text('image_url'),
  status: text('status', { enum: ['seed', 'published'] }),
  createdByUserId: text('created_by_user_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'number' })
    .notNull()
    .default(sql`(cast(unixepoch('now', 'subsec') * 1000 as integer))`),
});

// UserPets junction table
export const userPets = sqliteTable(
  'user_pets',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    petId: text('pet_id')
      .notNull()
      .references(() => pets.id),
    addedAt: integer('added_at', { mode: 'number' })
      .notNull()
      .default(sql`(cast(unixepoch('now', 'subsec') * 1000 as integer))`),
  },
  (table) => ({
    // Composite unique constraint on userId and petId
    userPetUnique: unique().on(table.userId, table.petId),
  })
);

// Generations table
export const generations = sqliteTable('generations', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  prompt: text('prompt'),
  model: text('model'),
  inputTokens: integer('input_tokens'),
  outputTokens: integer('output_tokens'),
  costUsd: real('cost_usd'),
  latencyMs: integer('latency_ms'),
  createdAt: integer('created_at', { mode: 'number' })
    .notNull()
    .default(sql`(cast(unixepoch('now', 'subsec') * 1000 as integer))`),
});

// Export TypeScript types using $inferSelect
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Pet = typeof pets.$inferSelect;
export type NewPet = typeof pets.$inferInsert;

export type UserPet = typeof userPets.$inferSelect;
export type NewUserPet = typeof userPets.$inferInsert;

export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;
