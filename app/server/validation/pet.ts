import { z } from 'zod';

// Pet Draft validation schema
export const PetDraftZ = z.object({
  // Name: 2 to 40 characters
  name: z.string().min(2).max(40),

  // Species: 2 to 30 characters
  species: z.string().min(2).max(30),

  // Traits: array of 3 to 6 strings, each 2 to 20 characters
  traits: z.array(z.string().min(2).max(20)).min(3).max(6),

  // Description: 80 to 1200 characters
  description: z.string().min(80).max(1200),

  // Care instructions: 8 to 14 lines, each starting with "- "
  // Can be either a string or an array (array will be joined)
  careInstructions: z
    .union([z.string(), z.array(z.string())])
    .transform((value) => {
      // If it's an array, join with newlines
      if (Array.isArray(value)) {
        return value.join('\n');
      }
      return value;
    })
    .refine(
      (value) => {
        const lines = value.split('\n').filter((line) => line.trim().length > 0);
        return lines.length >= 8 && lines.length <= 14;
      },
      { message: 'Care instructions must have 8 to 14 lines' }
    )
    .refine(
      (value) => {
        const lines = value.split('\n').filter((line) => line.trim().length > 0);
        return lines.every((line) => line.trim().startsWith('- '));
      },
      { message: 'Each care instruction line must start with "- "' }
    ),

  // Price in cents: integer between 5000 and 150000 (i.e., $50 to $1500)
  priceCents: z.number().int().min(5000).max(150000),

  // Image prompt: 20 to 800 characters
  imagePrompt: z.string().min(20).max(800),
}).strict();

// Accept Draft schema: PetDraftZ + imageUrl, but without imagePrompt
// (imagePrompt is only needed for generation, not for saving)
export const AcceptDraftZ = PetDraftZ.omit({ imagePrompt: true }).extend({
  // imageUrl can be a relative path or full URL
  imageUrl: z.string().min(1),
});

// Export TypeScript types
export type PetDraft = z.infer<typeof PetDraftZ>;
export type AcceptDraft = z.infer<typeof AcceptDraftZ>;
