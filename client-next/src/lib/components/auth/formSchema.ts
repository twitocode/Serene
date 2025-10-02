import { z } from "zod/v4";

// Define outside the load function so the adapter can be cached
export const signUpSchema = z.object({
  email: z.email("Must be a valid email address"),
  password: z
    .string("You entered in nothing")
    .min(6, "Password must be more than 6 characters")
    .max(30, "Password must be less than 30 characters"),
});

//login schema is not as complex
export const loginSchema = z.object({
  email: z.email("You did not enter proper email"),
  password: z
    .string("Please type in a password")
    .min(6, "Password must be more than 6 characters")
    .max(30, "Password must be less than 30 characters"),
});

export const setupProfileSchema = z.object({
  firstName: z.string().max(20),
  lastName: z.string().max(30),
  username: z.string().max(15),
  country: z.string(),
  avatarUrl: z.string(),
  pronouns: z.string(),
  dateOfBirth: z.string(),
  gender: z.string(),
});

export type SetupProfileSchema = typeof setupProfileSchema;
export type LoginFormSchema = typeof loginSchema;
