import { z } from 'zod/v4';


// Define outside the load function so the adapter can be cached
export const signUpSchema = z.object({
  email: z.email("Must be a valid email address"),
  password: z.string().min(6, "Password must be more than 6 characters").max(30, "Password must be less than 30 characters")
});

//login schema is not as complex
export const loginSchema = z.object({
  email: z.email(),
  password: z.string()
});

export type LoginFormSchema = typeof loginSchema;