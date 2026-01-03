import { SUPPORTED_COUNTRY_CODES } from "@/lib/get-country-codes";
import { z } from "zod";

export const stepOneSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s-]+$/, "Name can only contain letters, spaces, hyphens"),
});

const pronounsRegex =
  /^(She\s?[\/\-]\s?Her|He\s?[\/\-]\s?Him|They\s?[\/\-]\s?Them|Prefer not to say)$/i;

export const stepTwoSchema = z.object({
  age: z
    .number()
    .min(13, "You must be at least 13 years old")
    .max(120, "Please enter a valid age"),
  gender: z.enum(["Male", "Female", "Non-Binary", "Prefer not to say"], {
    message: "Please select a gender",
  }),
  pronouns: z.string().regex(pronounsRegex, "Invalid pronouns")
});

export const stepThreeSchema = z.object({
  countryCode: z.string().min(1, "Country is required"),
});

export const stepFourSchema = z.object({
  name: z
    .string(),
    // .min(1, "School is required")
    // .min(2, "School name must be at least 2 characters")
    // .max(100, "School name must be less than 100 characters"),
  countryCode: z.enum(SUPPORTED_COUNTRY_CODES, {
    error: () => ({ message: "Please select a supported country" }),
  }),
  city: z.string("City not provided"),
  regionCode: z
    .string("Region code not provided")
    // .length(3, "Not a region code"),
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
  koalaColour: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please select a valid color for your koala"),
  koalaPronouns: z
    .string()
    .max(50, "Koala pronouns must be less than 50 characters")
});

export const onboardingFormSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
  ...stepFourSchema.shape,
  ...stepFiveSchema.shape,
});

export type StepOneSchema = z.infer<typeof stepOneSchema>;
export type StepTwoSchema = z.infer<typeof stepTwoSchema>;
export type StepThreeSchema = z.infer<typeof stepThreeSchema>;
export type StepFourSchema = z.infer<typeof stepFourSchema>;
export type StepFiveSchema = z.infer<typeof stepFiveSchema>;
export type OnboardingSchema = z.infer<typeof onboardingFormSchema>;
