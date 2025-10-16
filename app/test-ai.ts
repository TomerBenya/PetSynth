// Test AI generation modules
import { generatePetDraft } from './server/ai/llm.js';
import { createImage } from './server/ai/image.js';

async function test() {
  console.log('Testing AI generation modules...\n');

  // Test LLM generation (mock)
  console.log('1. Testing generatePetDraft (mock provider)...');
  const result = await generatePetDraft('a cloud ferret that orbits heads');
  console.log('✓ Draft generated:', {
    name: result.draft.name,
    species: result.draft.species,
    traits: result.draft.traits,
    model: result.model,
  });

  // Test image generation (none provider)
  console.log('\n2. Testing createImage (none provider)...');
  const imageResult = await createImage(result.draft.imagePrompt, result.draft.name);
  console.log('✓ Image URL:', imageResult.imageUrl);
  if (imageResult.warning) {
    console.log('  Warning:', imageResult.warning);
  }

  console.log('\n✓ All AI modules working correctly!');
}

test().catch(console.error);
