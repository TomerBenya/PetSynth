// AI generation routes
import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { requireUser, User } from '../middleware/auth.js';
import { db } from '../db/client.js';
import { generations, pets as petsTable, userPets } from '../db/schema.js';
import { GenerateRequestZ } from '../validation/generate.js';
import { PetDraftZ, AcceptDraftZ } from '../validation/pet.js';
import { generatePetDraft } from '../ai/llm.js';
import { createImage } from '../ai/image.js';
import { handle } from '../middleware/errors.js';

// Define context variables type
type Variables = {
  user: User;
};

const generate = new Hono<{ Variables: Variables }>();

/**
 * POST /api/generate
 * Generate a pet draft from a text prompt
 */
generate.post('/', requireUser, async (c) => {
  try {
    const user = c.get('user');

    // Parse and validate request
    const body = await c.req.json();
    const parsed = GenerateRequestZ.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: 'Invalid input', details: parsed.error.issues }, 400);
    }

    const { prompt } = parsed.data;

    // Measure latency and generate draft
    const startTime = Date.now();
    const llmResult = await generatePetDraft(prompt);
    const latencyMs = Date.now() - startTime;

    // Validate generated draft
    const draftValidation = PetDraftZ.safeParse(llmResult.draft);
    if (!draftValidation.success) {
      console.error('Generated draft validation failed:', draftValidation.error);
      return c.json(
        {
          error: 'Generated draft validation failed',
          details: draftValidation.error.issues,
        },
        500
      );
    }

    const draft = draftValidation.data;

    // Generate image
    const imageResult = await createImage(draft.imagePrompt, draft.name);

    // Insert generation record
    const generationId = nanoid();
    await db.insert(generations).values({
      id: generationId,
      userId: user.id,
      prompt,
      model: llmResult.model,
      inputTokens: llmResult.usage?.inputTokens ?? null,
      outputTokens: llmResult.usage?.outputTokens ?? null,
      costUsd: llmResult.usage?.costUsd ?? null,
      latencyMs,
      createdAt: Date.now(),
    });

    // Return draft with image URL
    const response: any = {
      draft: {
        ...draft,
        imageUrl: imageResult.imageUrl,
      },
    };

    if (imageResult.warning) {
      response.imageWarning = imageResult.warning;
    }

    return c.json(response);
  } catch (error) {
    console.error('Generation error:', error);
    return handle(c, error instanceof Error ? error : new Error('Generation failed'));
  }
});

/**
 * POST /api/generate/accept
 * Accept and publish a generated pet draft
 */
generate.post('/accept', requireUser, async (c) => {
  try {
    const user = c.get('user');

    // Parse and validate request
    const body = await c.req.json();
    console.log('[Accept] Received body:', JSON.stringify(body, null, 2));

    // Remove imagePrompt from body if present (it's only needed for generation)
    const { imagePrompt, ...bodyWithoutPrompt } = body;

    const parsed = AcceptDraftZ.safeParse(bodyWithoutPrompt);

    if (!parsed.success) {
      console.error('[Accept] Validation failed:', JSON.stringify(parsed.error.issues, null, 2));
      return c.json({ error: 'Invalid draft', details: parsed.error.issues }, 400);
    }

    const draft = parsed.data;

    // Create pet ID
    const petId = nanoid();

    // Insert pet into database
    await db.insert(petsTable).values({
      id: petId,
      name: draft.name,
      species: draft.species,
      traitsJson: JSON.stringify(draft.traits),
      description: draft.description,
      careInstructions: draft.careInstructions,
      priceCents: draft.priceCents,
      imageUrl: draft.imageUrl,
      status: 'published',
      createdByUserId: user.id,
      createdAt: Date.now(),
    });

    // Add to user's pets (unique upsert via INSERT OR IGNORE)
    const userPetId = nanoid();
    await db.insert(userPets).values({
      id: userPetId,
      userId: user.id,
      petId,
      addedAt: Date.now(),
    });

    // Fetch and return the saved pet
    const savedPet = await db
      .select()
      .from(petsTable)
      .where(eq(petsTable.id, petId))
      .get();

    if (!savedPet) {
      throw new Error('Failed to retrieve saved pet');
    }

    return c.json(savedPet, 201);
  } catch (error) {
    console.error('Accept draft error:', error);
    return handle(c, error instanceof Error ? error : new Error('Failed to accept draft'));
  }
});

export default generate;
