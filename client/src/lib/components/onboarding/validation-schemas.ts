import { z } from "zod";

export const stepOneSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces, hyphens"),
});

const pronounsRegex = /^(She\s?[\/\-]\s?Her|He\s?[\/\-]\s?Him|They\s?[\/\-]\s?Them|Prefer not to say)$/i;

export const stepTwoSchema = z.object({
  age: z
    .number()
    .min(13, "You must be at least 13 years old")
    .max(120, "Please enter a valid age"),
  gender: z.enum(["Male", "Female", "Non-Binary", "Prefer-not-to-say"], {
    message: "Please select a gender",
  }),
  pronouns: z.string().regex(pronounsRegex, "Invalid pronouns").optional(),
});

export const stepThreeSchema = z.object({
  country: z.string().min(1, "Country is required"),
});

export const stepFourSchema = z.object({
  school: z
    .string()
    .min(1, "School is required")
    .min(2, "School name must be at least 2 characters")
    .max(100, "School name must be less than 100 characters"),
});

export const stepFiveSchema = z.object({
  koalaName: z
    .string()
    .min(1, "Koala name is required")
    .min(2, "Koala name must be at least 2 characters")
    .max(30, "Koala name must be less than 30 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Koala name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  koalaColour: z.enum(["Gray", "Brown", "White", "Black", "Cream", "Tan"], {
    message: "Please select a color for your koala",
  }),
  koalaPronouns: z
    .string()
    .max(50, "Koala pronouns must be less than 50 characters")
    .optional(),
});

export const onboardingFormSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)
  .merge(stepFourSchema)
  .merge(stepFiveSchema);

export type StepOneForm = z.infer<typeof stepOneSchema>;
export type StepTwoForm = z.infer<typeof stepTwoSchema>;
export type StepThreeForm = z.infer<typeof stepThreeSchema>;
export type StepFourForm = z.infer<typeof stepFourSchema>;
export type StepFiveForm = z.infer<typeof stepFiveSchema>;
export type OnboardingForm = z.infer<typeof onboardingFormSchema>;
