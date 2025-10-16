import { z } from 'zod';

// Generate request schema
export const GenerateRequestZ = z.object({
  prompt: z.string().min(4).max(400),
}).strict();

// Export type
export type GenerateRequest = z.infer<typeof GenerateRequestZ>;
