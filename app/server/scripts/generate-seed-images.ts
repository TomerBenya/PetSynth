#!/usr/bin/env bun
/**
 * Generate images for all seed pets using OpenAI DALL-E 3
 *
 * Usage:
 *   bun run app/server/scripts/generate-seed-images.ts
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

// Image prompts for each seed pet
const imagePrompts: Record<string, string> = {
  'pet-1': 'A floating ethereal cloud ferret made of iridescent mist and static electricity, orbiting in mid-air, soft glowing fur with tiny lightning sparks, whimsical creature, magical atmosphere, studio photography, centered composition, clean gradient background',

  'pet-2': 'A mystical cat with crystalline whiskers that emit sound waves, elegant feline with translucent musical antennae, ethereal glow, vintage theremin aesthetics, art deco style, centered composition, professional pet photography',

  'pet-3': 'A brass and copper mechanical axolotl with visible clockwork gears, steampunk amphibian with spinning gill propellers, shiny metallic finish, aquatic setting with gears visible through translucent body, professional product photography, centered, clean background',

  'pet-4': 'A hyperactive mole-rat vibrating with energy, wearing tiny sunglasses, coffee beans scattered around, motion blur effect showing extreme speed, comedic energy, expresso-powered creature, studio lighting, centered composition',

  'pet-5': 'A regal basilisk lizard covered in luxurious crushed velvet scales that shimmer like oil on water, elegant pose, full-length mirror in background, dramatic lighting, fashion photography style, centered composition, glamorous atmosphere',

  'pet-6': 'A gecko with fractal patterns repeating infinitely on its scales, each scale contains a smaller version of itself, mathematical beauty, Mandelbrot set inspired, iridescent colors, mind-bending geometry, centered composition, clean background',

  'pet-7': 'A ghostly hound made of fog appearing in a liminal doorway, eerie atmospheric dog with translucent misty form, flickering fluorescent lights, unsettling but loyal expression, liminal space aesthetics, moody lighting, centered composition',

  'pet-8': 'A butterfly composed of 16x16 pixel art grid, 8-bit digital creature with visible square pixels, retro video game aesthetic, chromatic aberration trails, bright primary colors, pixel perfect, centered composition, dark background',

  'pet-9': 'A vibrant songbird surrounded by visible colorful sound waves and musical notes, synesthetic visualization with rainbow spectrum emanating from bird, psychedelic but elegant, musical staff patterns, centered composition, studio photography',

  'pet-10': 'A hamster that appears simultaneously in two positions at once, quantum superposition effect, translucent overlapping forms, scientific but cute, Schrödinger equation inspired, physics visualization, clean background, centered composition',

  'pet-11': 'A rabbit made of crystal prism material with rainbows refracting through its body, spectral light beams, optical physics visualization, sparkling transparent fur, colorful rainbow trails, professional product photography, white background',

  'pet-12': 'A raven with echo effect showing multiple fading repetitions trailing behind it, sound wave visualization, acoustic patterns, each echo slightly more distorted, dark and atmospheric, centered composition, gradient background',

  'pet-13': 'An ancient wise tortoise with philosophical symbols carved into its shell, reading glasses, surrounded by ancient books, contemplative expression, library setting, warm lighting, scholarly atmosphere, centered composition',

  'pet-14': 'A sloth made entirely of iridescent soap bubbles, translucent and fragile, rainbow shimmer, slow motion captured, ultra delicate, dreamlike quality, soft pastel colors, centered composition, clean background',

  'pet-15': 'An eel swimming through glowing circuit boards and electrical wires, corrupted digital glitch effects, error message symbols floating around, neon cyberpunk colors, technological chaos, centered composition, dark background',

  'pet-16': 'A cat rendered as a probability cloud with fuzzy uncertain boundaries, quantum physics visualization, statistical distribution visualization, translucent overlapping positions, scientific but cute, bell curve aesthetic, clean background',

  'pet-17': 'An owl that appears as a dark void silhouette with glowing eyes, anti-light effect, absence of color creating shape, profound and mysterious, minimalist, negative space art, centered composition, gradient background',

  'pet-18': 'A terrier whose body is composed of perfect tessellating geometric tiles, Escher-inspired mathematical patterns, seamless tiling, colorful geometric shapes, mathematical precision, artistic but cute, centered composition, white background',

  'pet-19': 'A fish made of interference wave patterns, constructive and destructive waves visible, physics visualization, rippling water effects, harmonic oscillations, scientific beauty, aquatic setting, centered composition, gradient background',

  'pet-20': 'A Möbius strip snake with impossible topology, continuous one-sided surface, mathematical sculpture, the head connects to tail in paradoxical way, mind-bending geometry, metallic sheen, centered composition, clean background',
};

async function generateImage(petId: string, prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not set in .env');
    return null;
  }

  const client = new OpenAI({ apiKey });

  try {
    console.log(`🎨 Generating image for ${petId}...`);

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
      console.error(`❌ No image URL returned for ${petId}`);
      return null;
    }

    console.log(`✅ Generated image for ${petId}: ${tempImageUrl.substring(0, 60)}...`);

    // Download and save image locally
    try {
      const filename = generateImageFilename(petId);
      const localImageUrl = await downloadAndSaveImage(tempImageUrl, filename);
      console.log(`   💾 Saved locally: ${localImageUrl}`);
      return localImageUrl;
    } catch (downloadError) {
      console.error(`   ⚠️  Failed to save locally, using temporary URL:`, downloadError);
      return tempImageUrl;
    }
  } catch (error) {
    console.error(`❌ Error generating image for ${petId}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting image generation for seed pets...\n');

  // Fetch all seed pets
  const seedPets = await db
    .select()
    .from(pets)
    .where(eq(pets.status, 'seed'))
    .all();

  console.log(`Found ${seedPets.length} seed pets\n`);

  let successCount = 0;
  let failCount = 0;

  for (const pet of seedPets) {
    const prompt = imagePrompts[pet.id];

    if (!prompt) {
      console.log(`⚠️  No image prompt defined for ${pet.id} (${pet.name})`);
      failCount++;
      continue;
    }

    console.log(`\n📝 ${pet.name} (${pet.species})`);
    console.log(`   Prompt: ${prompt.substring(0, 80)}...`);

    const imageUrl = await generateImage(pet.id, prompt);

    if (imageUrl) {
      // Update pet with new image URL
      await db
        .update(pets)
        .set({ imageUrl })
        .where(eq(pets.id, pet.id));

      successCount++;
      console.log(`   ✓ Updated database with image URL`);

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ Complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Total: ${seedPets.length}\n`);

  sqlite.close();
}

// Run if executed directly
if (import.meta.main) {
  main().catch(console.error);
}
