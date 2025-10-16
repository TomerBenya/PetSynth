import { z } from 'zod';

// Register schema
export const RegisterZ = z.object({
  username: z.string().min(3).max(24),
  password: z.string().min(6).max(72),
}).strict();

// Login schema
export const LoginZ = z.object({
  username: z.string().min(3).max(24),
  password: z.string().min(6).max(72),
}).strict();

// Export types
export type Register = z.infer<typeof RegisterZ>;
export type Login = z.infer<typeof LoginZ>;
