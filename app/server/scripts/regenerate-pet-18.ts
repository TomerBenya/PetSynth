#!/usr/bin/env bun
/**
 * Regenerate image for pet-18 with modified prompt
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env from project root
dotenv.config({ path: resolve(import.meta.dir, '../../../.env') });

import { db, sqlite } from '../db/client.js';
import { pets } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';
import { downloadAndSaveImage, generateImageFilename } from '../utils/download-image.js';

async function regeneratePet18() {
  console.log('🎨 Regenerating image for pet-18 (Puzzle the Tessellation Terrier)...\n');

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not set in .env');
    return;
  }

  const client = new OpenAI({ apiKey });

  // Modified prompt to avoid safety issues - simpler and more straightforward
  const prompt = 'A cute terrier dog with a geometric patterned coat, featuring repeating shapes like squares and triangles on its fur, playful expression, professional pet photography, centered composition, clean white background, studio lighting';

  try {
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
    console.log('🎨 Generating image...');

    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid',
    });

    const tempImageUrl = response.data?.[0]?.url;

    if (!tempImageUrl) {
      console.error('❌ No image URL returned');
      return;
    }

    console.log(`✅ Generated image: ${tempImageUrl.substring(0, 60)}...`);

    // Download and save locally
    const filename = generateImageFilename('pet-18');
    const localImageUrl = await downloadAndSaveImage(tempImageUrl, filename);
    console.log(`💾 Saved locally: ${localImageUrl}`);

    // Update database
    await db
      .update(pets)
      .set({ imageUrl: localImageUrl })
      .where(eq(pets.id, 'pet-18'));

    console.log('✓ Updated database with image URL');
    console.log('\n✅ Success! Pet-18 now has a permanent local image.');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  } finally {
    sqlite.close();
  }
}

// Run
regeneratePet18();
