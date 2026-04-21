"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft2 } from "iconsax-reactjs";
import { useState } from "react";
import { completeStep2, completeStep3 } from "@/lib/client/onboarding-client";
import FormError from "@/lib/components/common/forms/form-error";
import { OnboardingDatePicker } from "@/lib/components/onboarding/date-picker";
import { useOnboardingStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/lib/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/lib/components/ui/tanstack-form";
import {
	type StepTwoCombinedSchema,
	type StepTwoCombinedValues,
	stepTwoCombinedSchema,
} from "@/lib/validation";

export function StepTwoCombined() {
	const {
		dateOfBirth,
		setDateOfBirth,
		gender,
		setGender,
		pronouns,
		setPronouns,
		countryCode: country,
		setCountryCode: setCountry,
		completeServerSteps,
		goBack,
		hasStarted,
	} = useOnboardingStore((state) => state);
	const [serverError, setServerError] = useState("");

	const mutation = useMutation({
		mutationFn: async (values: StepTwoCombinedSchema) => {
			const res2 = await completeStep2(
				values.dateOfBirth,
				values.gender,
				values.pronouns,
			);
			if (!res2.isSuccess) return res2;
			return await completeStep3(values.countryCode);
		},
	});

	const defaultValues: StepTwoCombinedSchema = {
		dateOfBirth: hasStarted ? dateOfBirth : "",
		gender: hasStarted && gender ? gender : "",
		pronouns: hasStarted && pronouns ? pronouns : "",
		countryCode: hasStarted && country ? country : "CA",
	};

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: stepTwoCombinedSchema,
		},
		onSubmit: async ({ value }) => {
			setDateOfBirth(value.dateOfBirth);
			setGender(value.gender);
			setPronouns(value.pronouns);
			setCountry(value.countryCode);

			const result = await mutation.mutateAsync(value);

			if (result.isSuccess) {
				completeServerSteps(2);
				return;
			}

			if (result.errorCode === "VALIDATION_ERROR") {
				Object.keys(result.errors!).forEach((key) => {
					const fieldName = key as StepTwoCombinedValues;
					form.setFieldMeta(fieldName, (prev) => ({
						...prev,
						errorMap: {
							onSubmit: [result.errors![key]],
						},
					}));
				});
			} else {
				setServerError(
					result.message ?? "Something weird happened on the server",
				);
			}
		},
	});

	return (
		<div className="text-center space-y-6 max-w-md w-full">
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Tell us about yourself</h2>
				<p className="text-gray-500 text-sm">
					This helps us personalize your experience
				</p>
			</div>

			<Form>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.Field name="dateOfBirth">
						{(field) => (
							<FormField field={field}>
								<FormItem>
									<FormLabel>Date of Birth</FormLabel>
									<FormControl>
										<div className="w-full">
											<OnboardingDatePicker
												value={field.state.value}
												onChange={(date) => {
													field.handleChange(date);
													if (field.state.meta.errorMap.onSubmit) {
														field.setMeta((prev) => ({
															...prev,
															errorMap: {
																...prev.errorMap,
																onSubmit: undefined,
															},
														}));
													}
												}}
												onBlur={field.handleBlur}
											/>
										</div>
									</FormControl>
									<FormMessage className="text-left" />
								</FormItem>
							</FormField>
						)}
					</form.Field>

					<div className="grid grid-cols-2 gap-4">
						<form.Field name="gender">
							{(field) => (
								<FormField field={field}>
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<FormControl>
											<Select
												value={field.state.value}
												onValueChange={(value) => {
													field.handleChange(value);
													if (field.state.meta.errorMap.onSubmit) {
														field.setMeta((prev) => ({
															...prev,
															errorMap: {
																...prev.errorMap,
																onSubmit: undefined,
															},
														}));
													}
												}}
												onOpenChange={(open) => {
													if (!open) field.handleBlur();
												}}
											>
												<SelectTrigger className="bg-white border border-border shadow-sm focus-visible:ring-primary/20 transition-all duration-200 w-full">
													<SelectValue placeholder="Select gender" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Male">Male</SelectItem>
													<SelectItem value="Female">Female</SelectItem>
													<SelectItem value="Non-Binary">Non-binary</SelectItem>
													<SelectItem value="Prefer not to say">
														Prefer not to say
													</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage className="text-left" />
									</FormItem>
								</FormField>
							)}
						</form.Field>

						<form.Field name="pronouns">
							{(field) => (
								<FormField field={field}>
									<FormItem>
										<FormLabel>Pronouns</FormLabel>
										<FormControl>
											<Select
												value={field.state.value}
												onValueChange={(value) => {
													field.handleChange(value);
													if (field.state.meta.errorMap.onSubmit) {
														field.setMeta((prev) => ({
															...prev,
															errorMap: {
																...prev.errorMap,
																onSubmit: undefined,
															},
														}));
													}
												}}
												onOpenChange={(open) => {
													if (!open) field.handleBlur();
												}}
											>
												<SelectTrigger className="bg-white border border-border shadow-sm focus-visible:ring-primary/20 transition-all duration-200 w-full">
													<SelectValue placeholder="Select Pronouns" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="He/Him">He/Him</SelectItem>
													<SelectItem value="She/Her">She/Her</SelectItem>
													<SelectItem value="They/Them">They/Them</SelectItem>
													<SelectItem value="Prefer not to say">
														Prefer not to say
													</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage className="text-left" />
									</FormItem>
								</FormField>
							)}
						</form.Field>
					</div>

					<FormError error={serverError} />

					<div className="flex gap-4">
						<Button
							onClick={goBack}
							variant="outline"
							className="flex-1 bg-white shadow-sm"
							type="button"
						>
							<ArrowLeft2
								variant="Outline"
								size={16}
								color="currentColor"
								className="mr-2"
							/>
							Back
						</Button>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									className="flex-1"
									disabled={!canSubmit || isSubmitting || mutation.isPending}
								>
									{mutation.isPending ? "Validating..." : "Continue"}
								</Button>
							)}
						</form.Subscribe>
					</div>
				</form>
			</Form>
		</div>
	);
}
