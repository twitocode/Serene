import { z } from "zod";

export const emailSchema = z.object({
  email: z.email("Not an email"),
});


export const signupSchema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
