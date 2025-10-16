// Pet management routes
import { Hono } from 'hono';
import { eq, or, like, inArray, sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import { pets as petsTable } from '../db/schema.js';

const pets = new Hono();

/**
 * Sanitize search query to escape SQL LIKE wildcards
 */
function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/%/g, '\\%')     // Escape %
    .replace(/_/g, '\\_');    // Escape _
}

/**
 * GET /api/pets
 * List pets with optional search and pagination
 */
pets.get('/', async (c) => {
  try {
    // Get query parameters
    const q = c.req.query('q') || '';
    const limitParam = c.req.query('limit');
    const offsetParam = c.req.query('offset');

    // Parse pagination parameters
    const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam)), 100) : 20;
    const offset = offsetParam ? Math.max(0, parseInt(offsetParam)) : 0;

    // Build query conditions
    let query = db
      .select()
      .from(petsTable)
      .where(inArray(petsTable.status, ['seed', 'published']));

    // Add search filter if query provided
    if (q.trim()) {
      const sanitized = sanitizeSearchQuery(q.trim());
      const searchPattern = `%${sanitized}%`;

      query = query.where(
        or(
          like(petsTable.name, searchPattern),
          like(petsTable.species, searchPattern),
          like(petsTable.description, searchPattern),
          like(petsTable.traitsJson, searchPattern)
        )
      );
    }

    // Execute query with pagination
    const items = await query
      .limit(limit)
      .offset(offset)
      .all();

    // Get total count for metadata
    let countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(petsTable)
      .where(inArray(petsTable.status, ['seed', 'published']));

    if (q.trim()) {
      const sanitized = sanitizeSearchQuery(q.trim());
      const searchPattern = `%${sanitized}%`;

      countQuery = countQuery.where(
        or(
          like(petsTable.name, searchPattern),
          like(petsTable.species, searchPattern),
          like(petsTable.description, searchPattern),
          like(petsTable.traitsJson, searchPattern)
        )
      );
    }

    const countResult = await countQuery.get();
    const total = countResult?.count || 0;

    // Return results with metadata
    return c.json({
      items,
      meta: {
        total,
        limit,
        offset,
        count: items.length,
      },
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    return c.json({ error: 'Failed to fetch pets' }, 500);
  }
});

/**
 * GET /api/pets/:id
 * Get a single pet by ID
 */
pets.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    // Find pet by ID
    const pet = await db
      .select()
      .from(petsTable)
      .where(eq(petsTable.id, id))
      .get();

    // Check if pet exists and is visible
    if (!pet) {
      return c.json({ error: 'Pet not found' }, 404);
    }

    // Check if pet is visible (status is 'seed' or 'published')
    if (pet.status !== 'seed' && pet.status !== 'published') {
      return c.json({ error: 'Pet not found' }, 404);
    }

    return c.json(pet);
  } catch (error) {
    console.error('Error fetching pet:', error);
    return c.json({ error: 'Failed to fetch pet' }, 500);
  }
});

export default pets;
