// LLM integration
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { PetDraft } from '../validation/pet.js';
import { SYSTEM_PROMPT, userPrompt } from './prompts.js';

/**
 * Mock draft for testing without API calls
 */
function mockDraft(prompt: string): PetDraft {
  return {
    name: 'Nimbus the Orbital Puff',
    species: 'Zero-G Cloud Ferret',
    traits: ['buoyant', 'electrostatic', 'purring'],
    description:
      'Nimbus is a semi-coherent puff of ionized fluff that orbits your head at a polite distance, chirping in Morse when it wants snacks. Its fur is more of a weather pattern than a texture, occasionally forming mini cumulonimbus for dramatic effect. Nimbus loves solar windowsills, jazz in odd meters, and the scent of printer toner. It will accompany you to meetings by drifting exactly 43 cm behind your left ear, providing moral support and occasional static confetti.',
    careInstructions: [
      '- Ground yourself before petting to avoid micro-lightning cuddles',
      '- Feed dehydrated rainbows on Tuesdays only',
      '- Do not store near ceiling fans or oscillating blades',
      '- If Nimbus splits into two, name the clone immediately',
      '- Sing a lullaby in Lydian mode nightly',
      '- Schedule solar basking during golden hour',
      '- Never mix with helium balloons or mylar',
      '- Groom with antistatic gloves and gentle clockwise motions',
    ].join('\n'),
    priceCents: 48900,
    imagePrompt:
      'A floating puffball ferret made of iridescent clouds, orbiting a person in an office, soft studio lighting, shallow depth of field, 50mm lens, whimsical high-contrast, crisp details',
  };
}

/**
 * Parse JSON response with retry logic
 */
function parseJSONResponse(text: string): any {
  // Try to extract JSON from markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }

  // Try direct parse
  return JSON.parse(text);
}

/**
 * Generate pet draft using Anthropic API
 */
async function generateWithAnthropic(idea: string): Promise<{
  draft: PetDraft;
  usage?: { inputTokens?: number; outputTokens?: number; costUsd?: number };
  model: string;
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const client = new Anthropic({ apiKey });
  const model = 'claude-3-5-sonnet-20241022';

  let lastError: Error | null = null;

  // Retry once on parse error
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt(idea),
          },
        ],
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic');
      }

      const parsed = parseJSONResponse(content.text);

      // Calculate cost (approximate)
      const inputTokens = response.usage.input_tokens;
      const outputTokens = response.usage.output_tokens;
      const costUsd = (inputTokens * 0.003 + outputTokens * 0.015) / 1000;

      return {
        draft: parsed,
        usage: { inputTokens, outputTokens, costUsd },
        model,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === 0) {
        console.warn('Parse error on first attempt, retrying...', lastError);
        continue;
      }
    }
  }

  throw lastError || new Error('Failed to generate pet draft');
}

/**
 * Generate pet draft using OpenAI API
 */
async function generateWithOpenAI(idea: string): Promise<{
  draft: PetDraft;
  usage?: { inputTokens?: number; outputTokens?: number; costUsd?: number };
  model: string;
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const client = new OpenAI({ apiKey });
  const model = 'gpt-4o-mini';

  let lastError: Error | null = null;

  // Retry once on parse error
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userPrompt(idea),
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      const parsed = parseJSONResponse(content);

      // Calculate cost (approximate)
      const inputTokens = response.usage?.prompt_tokens || 0;
      const outputTokens = response.usage?.completion_tokens || 0;
      const costUsd = (inputTokens * 0.00015 + outputTokens * 0.0006) / 1000;

      return {
        draft: parsed,
        usage: { inputTokens, outputTokens, costUsd },
        model,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === 0) {
        console.warn('Parse error on first attempt, retrying...', lastError);
        continue;
      }
    }
  }

  throw lastError || new Error('Failed to generate pet draft');
}

/**
 * Generate pet draft using configured AI provider
 */
export async function generatePetDraft(idea: string): Promise<{
  draft: PetDraft;
  usage?: { inputTokens?: number; outputTokens?: number; costUsd?: number };
  model: string;
}> {
  const provider = (process.env.AI_TEXT_PROVIDER ?? 'mock').toLowerCase();

  switch (provider) {
    case 'anthropic':
      return generateWithAnthropic(idea);

    case 'openai':
      return generateWithOpenAI(idea);

    case 'mock':
    default:
      return { draft: mockDraft(idea), model: 'mock' };
  }
}
