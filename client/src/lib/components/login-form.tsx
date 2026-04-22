"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { auth } from "@/lib/auth";
import FormError from "@/lib/components/common/forms/form-error";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Separator } from "@/lib/components/ui/separator";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/lib/components/ui/tanstack-form";
import { checkOnboarding } from "@/lib/server/onboarding-server";

const emailSchema = z.object({
	email: z.string().email("Invalid email address"),
});

const authSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm() {
	const [step, setStep] = useState(1);
	const [loginError, setLoginError] = useState("");

	const checkEmailMutation = useMutation({
		mutationFn: auth.checkEmail,
		onSuccess: (result) => {
			if (result.isSuccess) {
				if (result.data?.exists) {
					setStep(2);
					setLoginError("");
				} else {
					setLoginError("No accounts associated with this email. Please sign up.");
				}
			} else {
				setLoginError(result.message || "An error occurred. Please try again.");
			}
		},
	});

	const signInMutation = useMutation({
		mutationFn: auth.signIn,
		onSuccess: async (result) => {
			if (result.isSuccess) {
				try {
					const onboarding = await checkOnboarding();
					if (onboarding.completed) {
						window.location.href = "/home";
					} else {
						window.location.href = "/onboarding";
					}
				} catch (_e) {
					window.location.href = "/home";
				}
			} else {
				setLoginError(result.message || "Login failed. Please try again.");
			}
		},
	});

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: authSchema,
		},
		onSubmit: async ({ value }) => {
			signInMutation.mutate(value);
		},
	});

	const handleEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const emailValue = form.getFieldValue("email");
		const emailValidation = emailSchema.safeParse({ email: emailValue });

		if (emailValidation.success) {
			setLoginError("");
			checkEmailMutation.mutate(emailValue);
		} else {
			setLoginError(emailValidation.error.issues[0].message);
		}
	};

	const handleBack = () => {
		setStep(1);
		setLoginError("");
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col items-center gap-3 text-center">
				<Link
					href="/"
					className="flex items-center gap-3 transition-transform duration-200 hover:opacity-90"
				>
					<img
						src="/mochi/Mochi.svg"
						alt=""
						className="shrink-0 text-primary size-9"
					/>
				</Link>
				<h1 className="font-serif text-2xl font-semibold tracking-tight">
					Welcome Back
				</h1>
				<FormDescription>
					Don&apos;t have an account?{" "}
					<Link href="/signup" className="font-semibold hover:underline">
						Sign up
					</Link>
				</FormDescription>
			</div>

			<Form>
				<form
					onSubmit={(e) => {
						if (step === 1) {
							handleEmailSubmit(e);
						} else {
							e.preventDefault();
							form.handleSubmit();
						}
					}}
					className="space-y-4"
				>
					{step === 1 ? (
						<form.Field name="email">
							{(field) => (
								<FormField field={field}>
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="m@example.com"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
											/>
										</FormControl>
									</FormItem>
								</FormField>
							)}
						</form.Field>
					) : (
						<>
							<div className="flex flex-col gap-1">
								<p className="text-sm font-medium">Email</p>
								<div className="flex items-center justify-between">
									<p className="text-sm text-muted-foreground">
										{form.getFieldValue("email")}
									</p>
									<button
										type="button"
										onClick={handleBack}
										className="text-xs font-semibold text-primary hover:underline"
									>
										Change
									</button>
								</div>
							</div>
							<form.Field name="password">
								{(field) => (
									<FormField field={field}>
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Enter your password"
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													autoFocus
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									</FormField>
								)}
							</form.Field>
						</>
					)}

					<FormError error={loginError} />

					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<div className="flex gap-3">
								<Button
									type="submit"
									className="flex-1"
									disabled={
										(step === 1 && checkEmailMutation.isPending) ||
										(step === 2 && (!canSubmit || isSubmitting))
									}
								>
									{step === 1
										? checkEmailMutation.isPending
											? "Checking..."
											: "Continue"
										: signInMutation.isPending
											? "Logging in..."
											: "Login"}
								</Button>
							</div>
						)}
					</form.Subscribe>
				</form>
			</Form>

			<div className="relative my-1">
				<div className="absolute inset-0 flex items-center">
					<Separator className="w-full" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						or with
					</span>
				</div>
			</div>

			<Button
				variant="outline"
				className="w-full items-center justify-center space-x-2"
				asChild
			>
				<Link href="/api/auth/sign-in/google?returnUrl=http://localhost:3000/home">
					<svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
						<path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
					</svg>
					<span className="text-sm font-medium">Sign in with Google</span>
				</Link>
			</Button>

			<FormDescription className="px-6 text-center">
				By clicking continue, you agree to our{" "}
				<Link href="/terms">Terms of Service</Link> and{" "}
				<Link href="/privacy">Privacy Policy</Link>.
			</FormDescription>
		</div>
	);
}
