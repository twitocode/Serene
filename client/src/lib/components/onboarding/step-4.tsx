"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { completeStep4 } from "@/lib/client/onboarding-client";
import FormError from "@/lib/components/common/forms/form-error";
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
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/lib/components/ui/tabs";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/lib/components/ui/tanstack-form";
import { colleges, schools, universities } from "@/lib/data";
import {
	type StepFourSchema,
	type StepFourValues,
	stepFourSchema,
} from "@/lib/validation";

export function StepFour() {
	const { school, setSchool, completeServerStep, goBack, hasStarted } =
		useOnboardingStore((state) => state);

	const [activeTab, setActiveTab] = useState("universities");

	const [serverError, setServerError] = useState("");

	const mutation = useMutation({
		mutationFn: completeStep4,
	});

	const defaultValues: StepFourSchema = {
		name: hasStarted && school ? school : "McMaster University",

		countryCode: "CA",

		regionCode: "",

		city: "",
	};

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: stepFourSchema,
		},
		onSubmit: async ({ value }) => {
			const schoolObj = schools.find((s) => s.name === value.name);
			if (!schoolObj) return;
			setSchool(value.name);

			const result = await mutation.mutateAsync(schoolObj);
			if (result.isSuccess) {
				completeServerStep();
				return;
			}

			if (result.errorCode === "VALIDATION_ERROR") {
				Object.keys(result.errors!).forEach((key) => {
					const fieldName = key.toLowerCase() as StepFourValues;
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
				<h2 className="text-2xl font-semibold">What school do you attend?</h2>
				<p className="text-gray-500 text-sm">
					Select your university or college
				</p>
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
					<Image
						src="/university_logos/McMaster University.jpg"
						alt="McMaster Logo"
						width={60}
						height={60}
						className="h-15 w-auto object-contain rounded-md bg-white shadow-sm shrink-0"
					/>
					<div className="text-left">
						<h3 className="text-xl font-bold">McMaster University</h3>
						<p className="text-sm text-muted-foreground">Hamilton, Ontario</p>
					</div>
				</div>
				<p className="text-xs text-muted-foreground italic">
					Serene is currently optimized for McMaster students.
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
					<form.Field name="name">
						{(field) => (
							<FormField field={field}>
								<FormItem>
									<FormControl>
										<input type="hidden" name={field.name} value="McMaster University" />
									</FormControl>
								</FormItem>
							</FormField>
						)}
					</form.Field>
					<FormError error={serverError} />

					<div className="flex gap-4 pt-4">
						<Button
							onClick={goBack}
							variant="outline"
							className="flex-1 bg-white shadow-sm"
							type="button"
						>
							<ChevronLeft className="w-4 h-4 mr-2" />
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
