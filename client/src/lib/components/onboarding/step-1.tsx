"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { completeStep1 } from "@/lib/client/onboarding-client";
import FormError from "@/lib/components/common/forms/form-error";
import { useOnboardingStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/lib/components/ui/tanstack-form";
import { type StepOneValues, stepOneSchema } from "@/lib/validation";

export function StepOne() {
	const { name, initialName, setName, completeServerStep, hasStarted } =
		useOnboardingStore((state) => state);
	const [serverError, setServerError] = useState("");
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: completeStep1,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const form = useForm({
		defaultValues: {
			name: hasStarted && name ? name : "",
		},
		validators: {
			onSubmit: stepOneSchema,
		},
		onSubmit: async ({ value }) => {
			// If user hasn't changed the name and they already have one, skip server validation
			if (initialName && value.name === initialName) {
				completeServerStep();
				return;
			}

			setName(value.name);
			const result = await mutation.mutateAsync(value.name);

			if (result.isSuccess) {
				completeServerStep();
				return;
			}

			if (result.errorCode === "VALIDATION_ERROR") {
				Object.keys(result.errors!).forEach((key) => {
					const fieldName = key.toLowerCase() as StepOneValues;
					form.setFieldMeta(fieldName, (prev) => ({
						...prev,
						errorMap: {
							onSubmit: [result.errors![key]],
						},
					}));
				});
			} else if (result.errorCode === "USERNAME_TAKEN") {
				form.setFieldMeta("name", (prev) => ({
					...prev,
					errorMap: {
						onSubmit: [result.message],
					},
				}));
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
				<h2 className="text-2xl font-semibold">What should we call you?</h2>
				<p className="text-gray-500 text-sm">This is your username</p>
			</div>

			<Form>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.Field name="name">
						{(field) => (
							<FormField field={field}>
								<FormItem>
									<FormLabel>Username</FormLabel>

									<FormControl>
										<Input
											placeholder="Name"
											value={field.state.value}
											onChange={(e) => {
												field.handleChange(e.target.value);
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
											className="bg-gray-100 border-0"
											autoFocus
											autoComplete="username"
											onBlur={field.handleBlur}
										/>
									</FormControl>
									<FormMessage className="text-left" />
								</FormItem>
							</FormField>
						)}
					</form.Field>
					<FormError error={serverError} />
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								className="bg-black hover:bg-gray-800 w-full"
								disabled={!canSubmit || isSubmitting || mutation.isPending}
							>
								{mutation.isPending ? "Validating..." : "Continue"}
							</Button>
						)}
					</form.Subscribe>
				</form>
			</Form>
		</div>
	);
}
