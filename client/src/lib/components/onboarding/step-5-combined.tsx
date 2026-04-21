"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft2 } from "iconsax-reactjs";
import { useState } from "react";
import { completeStep5, completeStep6 } from "@/lib/client/onboarding-client";
import { AnimatedMochi as Mochi } from "@/lib/components/common/animated-mochi";
import FormError from "@/lib/components/common/forms/form-error";
import { useOnboardingStore } from "@/lib/components/providers/zustand-provider";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
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
import { STRUGGLES } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
	type StepFiveCombinedSchema,
	type StepFiveCombinedValues,
	stepFiveCombinedSchema,
} from "@/lib/validation";

export function StepFiveCombined() {
	const {
		mochiName,
		setMochiName,
		mochiPronouns,
		setMochiPronouns,
		struggles,
		setStruggles,
		goBack,
		completeServerSteps,
		hasStarted,
	} = useOnboardingStore((state) => state);
	const [serverError, setServerError] = useState("");

	const mutation = useMutation({
		mutationFn: async (values: StepFiveCombinedSchema) => {
			const res5 = await completeStep5(values.mochiName, values.mochiPronouns);
			if (!res5.isSuccess) return res5;
			return await completeStep6(values.struggles);
		},
	});

	const form = useForm({
		defaultValues: {
			mochiName: mochiName || "",
			mochiPronouns: mochiPronouns || "",
			struggles: hasStarted && struggles.length > 0 ? struggles : [],
		},
		validators: {
			onSubmit: stepFiveCombinedSchema,
		},
		onSubmit: async ({ value }) => {
			setMochiName(value.mochiName);
			setMochiPronouns(value.mochiPronouns);
			setStruggles(value.struggles);

			const result = await mutation.mutateAsync(value);
			if (result.isSuccess) {
				window.location.href = "/home";
				return;
			}

			if (result.errorCode === "VALIDATION_ERROR") {
				Object.keys(result.errors!).forEach((key) => {
					const fieldName = key as StepFiveCombinedValues;
					form.setFieldMeta(fieldName, (prev) => ({
						...prev,
						errorMap: {
							onSubmit: [result.errors![key]],
						},
					}));
				});
				if (result.errors?.struggles) {
					setServerError("Please select at least one item.");
				}
			} else {
				setServerError(
					result.message ?? "Something weird happened on the server",
				);
			}
		},
	});

	return (
		<div className="text-center space-y-6 max-w-2xl w-full">
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Meet Mochi!</h2>
				<p className="text-gray-500 text-sm">Your new wellness companion.</p>
			</div>

			<Form>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-8"
				>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left items-center">
						{/* Left Column: Mochi & Customization */}
						<div className="space-y-6">
							<div className="flex justify-center">
								<Mochi className="h-32 w-32 drop-shadow-lg" />
							</div>
							<div className="space-y-4">
								<h3 className="font-medium text-center">Customize Mochi</h3>
								<form.Field name="mochiName">
									{(field) => (
										<FormField field={field}>
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														placeholder="Mochi's name"
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
														className="bg-white border border-border shadow-sm focus-visible:ring-primary/20 transition-all duration-200"
														onBlur={field.handleBlur}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										</FormField>
									)}
								</form.Field>

								<form.Field name="mochiPronouns">
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
															<SelectItem value="They/Them">
																They/Them
															</SelectItem>
															<SelectItem value="Prefer not to say">
																Prefer not to say
															</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										</FormField>
									)}
								</form.Field>
							</div>
						</div>

						{/* Right Column: Struggles */}
						<div className="space-y-4 pt-2">
							<h3 className="font-medium text-center lg:text-left">
								What brings you here?
							</h3>
							<p className="text-sm text-muted-foreground text-center lg:text-left">
								Select all that apply.
							</p>
							<form.Field name="struggles">
								{(field) => (
									<FormField field={field}>
										<FormItem>
											<FormControl>
												<div className="flex flex-wrap gap-2 justify-center lg:justify-start">
													{STRUGGLES.map((struggle) => {
														const isSelected =
															field.state.value.includes(struggle);
														return (
															<button
																key={struggle}
																type="button"
																onClick={() => {
																	const newValue = isSelected
																		? field.state.value.filter(
																				(s) => s !== struggle,
																			)
																		: [...field.state.value, struggle];
																	field.handleChange(newValue);
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
																className={cn(
																	"px-3 py-1.5 rounded-full border transition-colors text-xs shadow-sm",
																	isSelected
																		? "bg-primary text-primary-foreground border-primary"
																		: "bg-white text-foreground border-border hover:border-primary/50",
																)}
															>
																{struggle}
															</button>
														);
													})}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									</FormField>
								)}
							</form.Field>
						</div>
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
									{mutation.isPending ? "Finalizing..." : "Complete"}
								</Button>
							)}
						</form.Subscribe>
					</div>
				</form>
			</Form>
		</div>
	);
}
