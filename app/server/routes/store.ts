// Store routes
import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { eq, and, inArray } from 'drizzle-orm';
import { requireUser, User } from '../middleware/auth.js';
import { db } from '../db/client.js';
import { userPets, pets as petsTable } from '../db/schema.js';
import { handle } from '../middleware/errors.js';

// Define context variables type
type Variables = {
  user: User;
};

const store = new Hono<{ Variables: Variables }>();

/**
 * GET /api/store
 * Get user's pet collection with minimal fields
 */
store.get('/', requireUser, async (c) => {
  try {
    const user = c.get('user');

    // Join userPets with pets table
    const userPetsResult = await db
      .select({
        id: petsTable.id,
        name: petsTable.name,
        species: petsTable.species,
        priceCents: petsTable.priceCents,
        imageUrl: petsTable.imageUrl,
      })
      .from(userPets)
      .innerJoin(petsTable, eq(userPets.petId, petsTable.id))
      .where(eq(userPets.userId, user.id))
      .all();

    return c.json(userPetsResult);
  } catch (error) {
    console.error('Store fetch error:', error);
    return handle(c, error instanceof Error ? error : new Error('Failed to fetch store'));
  }
});

/**
 * POST /api/store
 * Add a pet to user's store
 */
store.post('/', requireUser, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { petId } = body;

    if (!petId || typeof petId !== 'string') {
      return c.json({ error: 'petId is required' }, 400);
    }

    // Check if pet exists and is visible
    const pet = await db
      .select()
      .from(petsTable)
      .where(eq(petsTable.id, petId))
      .get();

    if (!pet) {
      return c.json({ error: 'Pet not found' }, 404);
    }

    // Check if pet is published or seed
    if (!pet.status || !['published', 'seed'].includes(pet.status)) {
      return c.json({ error: 'Pet not available' }, 400);
    }

    // Check if already in store
    const existing = await db
      .select()
      .from(userPets)
      .where(and(eq(userPets.userId, user.id), eq(userPets.petId, petId)))
      .get();

    if (existing) {
      return c.json({ message: 'Pet already in store' }, 200);
    }

    // Add to store
    const userPetId = nanoid();
    await db.insert(userPets).values({
      id: userPetId,
      userId: user.id,
      petId,
      addedAt: Date.now(),
    });

    return c.json({ message: 'Pet added to store', petId }, 201);
  } catch (error) {
    console.error('Store add error:', error);
    return handle(c, error instanceof Error ? error : new Error('Failed to add pet to store'));
  }
});

/**
 * DELETE /api/store/:petId
 * Remove a pet from user's store
 */
store.delete('/:petId', requireUser, async (c) => {
  try {
    const user = c.get('user');
    const petId = c.req.param('petId');

    // Delete from userPets
    const result = await db
      .delete(userPets)
      .where(and(eq(userPets.userId, user.id), eq(userPets.petId, petId)))
      .returning({ deletedId: userPets.id });

    if (!result || result.length === 0) {
      return c.json({ error: 'Pet not in store' }, 404);
    }

    return c.json({ message: 'Pet removed from store' });
  } catch (error) {
    console.error('Store remove error:', error);
    return handle(c, error instanceof Error ? error : new Error('Failed to remove pet from store'));
  }
});

export default store;
