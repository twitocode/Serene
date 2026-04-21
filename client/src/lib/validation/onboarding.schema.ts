import { z } from "zod";
import { SUPPORTED_COUNTRY_CODES } from "@/lib/get-country-codes";

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
	dateOfBirth: z
		.string()
		.min(1, "Date of birth is required")
		.refine((date) => {
			const birthDate = new Date(date);
			const today = new Date();
			const age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			const dayDiff = today.getDate() - birthDate.getDate();

			const actualAge =
				monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

			return actualAge >= 13 && actualAge <= 120;
		}, "You must greater than 13 years old"),
	gender: z
		.string()
		.refine(
			(val) =>
				["Male", "Female", "Non-Binary", "Prefer not to say"].includes(val),
			{
				message: "Please select a gender",
			},
		),
	pronouns: z.string().regex(pronounsRegex, "Invalid pronouns"),
});

export const stepThreeSchema = z.object({
	countryCode: z.string().min(1, "Country is required"),
});

export const stepFourSchema = z.object({
	name: z.string(),
	// .min(1, "School is required")
	// .min(2, "School name must be at least 2 characters")
	// .max(100, "School name must be less than 100 characters"),
	countryCode: z.enum(SUPPORTED_COUNTRY_CODES, {
		error: () => ({ message: "Please select a supported country" }),
	}),
	city: z.string("City not provided"),
	regionCode: z.string("Region code not provided"),
	// .length(3, "Not a region code"),
});

export const stepFiveSchema = z.object({
	mochiName: z
		.string()
		.min(1, "Mochi name is required")
		.min(2, "Mochi name must be at least 2 characters")
		.max(30, "Mochi name must be less than 30 characters")
		.regex(
			/^[a-zA-Z\s'-]+$/,
			"Mochi name can only contain letters, spaces, hyphens, and apostrophes",
		),
	mochiPronouns: z
		.string()
		.regex(pronounsRegex, "Mochi's pronouns were not provided"),
});

export const stepSixSchema = z.object({
	struggles: z.array(z.string()).min(1, "Please select at least one item"),
});

export const stepTwoCombinedSchema = stepTwoSchema.merge(stepThreeSchema);
export const stepFiveCombinedSchema = stepFiveSchema.merge(stepSixSchema);

export const onboardingFormSchema = z.object({
	...stepOneSchema.shape,
	...stepTwoSchema.shape,
	...stepThreeSchema.shape,
	...stepFourSchema.shape,
	...stepFiveSchema.shape,
	...stepSixSchema.shape,
});

export type StepOneSchema = z.infer<typeof stepOneSchema>;
export type StepTwoSchema = z.infer<typeof stepTwoSchema>;
export type StepThreeSchema = z.infer<typeof stepThreeSchema>;
export type StepFourSchema = z.infer<typeof stepFourSchema>;
export type StepFiveSchema = z.infer<typeof stepFiveSchema>;
export type StepSixSchema = z.infer<typeof stepSixSchema>;
export type StepTwoCombinedSchema = z.infer<typeof stepTwoCombinedSchema>;
export type StepFiveCombinedSchema = z.infer<typeof stepFiveCombinedSchema>;
export type OnboardingSchema = z.infer<typeof onboardingFormSchema>;

export type StepOneValues = keyof z.infer<typeof stepOneSchema>;
export type StepTwoValues = keyof z.infer<typeof stepTwoSchema>;
export type StepThreeValues = keyof z.infer<typeof stepThreeSchema>;
export type StepFourValues = keyof z.infer<typeof stepFourSchema>;
export type StepFiveValues = keyof z.infer<typeof stepFiveSchema>;
export type StepSixValues = keyof z.infer<typeof stepSixSchema>;
export type StepTwoCombinedValues = keyof z.infer<typeof stepTwoCombinedSchema>;
export type StepFiveCombinedValues = keyof z.infer<
	typeof stepFiveCombinedSchema
>;
export type OnboardingValues = keyof z.infer<typeof onboardingFormSchema>;
