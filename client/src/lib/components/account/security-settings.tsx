"use client";

import { useForm } from "@tanstack/react-form";
import {
	Eye,
	EyeOff,
	KeyRound,
	Loader2,
	Lock,
	ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/lib/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/lib/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/lib/components/ui/field";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import {
	useSettingsQuery,
	useUpdateSettingsMutation,
} from "@/lib/hooks/queries/use-settings";
import { useChangePasswordMutation } from "@/lib/hooks/queries/use-user";

export function SecuritySettings() {
	const { data: settings, isLoading: settingsLoading } = useSettingsQuery();
	const updateSettings = useUpdateSettingsMutation();
	const changePassword = useChangePasswordMutation();

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const passwordForm = useForm({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
		onSubmit: async ({ value }) => {
			if (value.newPassword !== value.confirmPassword) {
				toast.error("Passwords do not match");
				return;
			}
			try {
				await changePassword.mutateAsync({
					currentPassword: value.currentPassword,
					newPassword: value.newPassword,
				});
				toast.success("Password changed successfully!");
				passwordForm.reset();
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to change password",
				);
			}
		},
	});

	if (settingsLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Card className="card-organic border-0 shadow-lg">
				<CardHeader className="pb-4">
					<CardTitle className="text-xl">App Lock</CardTitle>
					<CardDescription>
						Secure your application with a lock screen password
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
							<div className="space-y-1">
								<p className="font-medium text-foreground flex items-center gap-2">
									Status:
									{settings?.passwordLock ? (
										<span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
											<ShieldCheck className="size-4" /> Enabled
										</span>
									) : (
										<span className="text-muted-foreground flex items-center gap-1">
											Disabled
										</span>
									)}
								</p>
								<p className="text-sm text-muted-foreground">
									{settings?.passwordLock
										? "Serene is protected with a password."
										: "Enable app lock to require a password when opening Serene."}
								</p>
							</div>
							{settings?.passwordLock && (
								<Button
									variant="destructive"
									size="sm"
									onClick={async () => {
										try {
											await updateSettings.mutateAsync({ passwordLock: "" });
											toast.success("App lock removed");
										} catch (_error) {
											toast.error("Failed to remove app lock");
										}
									}}
								>
									Remove Lock
								</Button>
							)}
						</div>

						<div className="pt-4 border-t border-border">
							<h3 className="text-sm font-medium mb-4">
								{settings?.passwordLock
									? "Change Lock Password"
									: "Set Lock Password"}
							</h3>
							<form
								onSubmit={async (e) => {
									e.preventDefault();
									const formData = new FormData(e.currentTarget);
									const password = formData.get("lockPassword") as string;
									const confirm = formData.get("confirmLockPassword") as string;

									if (!password) {
										toast.error("Please enter a password");
										return;
									}

									if (password !== confirm) {
										toast.error("Passwords do not match");
										return;
									}

									try {
										await updateSettings.mutateAsync({
											passwordLock: password,
										});
										toast.success(
											settings?.passwordLock
												? "App lock password updated"
												: "App lock enabled",
										);
										// Reset form
										(e.target as HTMLFormElement).reset();
									} catch (_error) {
										toast.error("Failed to update app lock");
									}
								}}
								className="space-y-4 max-w-md"
							>
								<div className="grid gap-2">
									<Label htmlFor="lockPassword">New Lock Password</Label>
									<Input
										id="lockPassword"
										name="lockPassword"
										type="password"
										placeholder="Enter lock password"
										minLength={4}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="confirmLockPassword">
										Confirm Lock Password
									</Label>
									<Input
										id="confirmLockPassword"
										name="confirmLockPassword"
										type="password"
										placeholder="Confirm lock password"
										minLength={4}
									/>
								</div>
								<Button
									type="submit"
									disabled={updateSettings.isPending}
									className="btn-playful"
								>
									{updateSettings.isPending ? (
										<>
											<Loader2 className="size-4 mr-2 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Lock className="size-4 mr-2" />
											{settings?.passwordLock
												? "Update Password"
												: "Set Password"}
										</>
									)}
								</Button>
							</form>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="card-organic border-0 shadow-lg">
				<CardHeader className="pb-4">
					<CardTitle className="text-xl">Change Account Password</CardTitle>
					<CardDescription>
						Update your account password to keep your account secure
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							passwordForm.handleSubmit();
						}}
					>
						<FieldGroup>
							<passwordForm.Field name="currentPassword">
								{(field) => (
									<Field>
										<FieldLabel htmlFor="currentPassword">
											Current Password
										</FieldLabel>
										<FieldDescription>
											Enter your current password to verify your identity
										</FieldDescription>
										<div className="relative max-w-md">
											<Input
												id="currentPassword"
												type={showCurrentPassword ? "text" : "password"}
												placeholder="Enter current password"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												className="pr-10"
											/>
											<button
												type="button"
												onClick={() =>
													setShowCurrentPassword(!showCurrentPassword)
												}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
											>
												{showCurrentPassword ? (
													<EyeOff className="size-4" />
												) : (
													<Eye className="size-4" />
												)}
											</button>
										</div>
										{field.state.meta.errors.length > 0 && (
											<FieldError>
												{field.state.meta.errors.join(", ")}
											</FieldError>
										)}
									</Field>
								)}
							</passwordForm.Field>

							<passwordForm.Field name="newPassword">
								{(field) => (
									<Field>
										<FieldLabel htmlFor="newPassword">New Password</FieldLabel>
										<FieldDescription>
											Choose a strong password with at least 8 characters
										</FieldDescription>
										<div className="relative max-w-md">
											<Input
												id="newPassword"
												type={showNewPassword ? "text" : "password"}
												placeholder="Enter new password"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												className="pr-10"
											/>
											<button
												type="button"
												onClick={() => setShowNewPassword(!showNewPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
											>
												{showNewPassword ? (
													<EyeOff className="size-4" />
												) : (
													<Eye className="size-4" />
												)}
											</button>
										</div>
										{field.state.meta.errors.length > 0 && (
											<FieldError>
												{field.state.meta.errors.join(", ")}
											</FieldError>
										)}
									</Field>
								)}
							</passwordForm.Field>

							<passwordForm.Field name="confirmPassword">
								{(field) => (
									<Field>
										<FieldLabel htmlFor="confirmPassword">
											Confirm New Password
										</FieldLabel>
										<FieldDescription>
											Re-enter your new password to confirm
										</FieldDescription>
										<div className="relative max-w-md">
											<Input
												id="confirmPassword"
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Confirm new password"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												className="pr-10"
											/>
											<button
												type="button"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
											>
												{showConfirmPassword ? (
													<EyeOff className="size-4" />
												) : (
													<Eye className="size-4" />
												)}
											</button>
										</div>
										{field.state.meta.errors.length > 0 && (
											<FieldError>
												{field.state.meta.errors.join(", ")}
											</FieldError>
										)}
									</Field>
								)}
							</passwordForm.Field>

							<div className="pt-4">
								<Button
									type="submit"
									disabled={changePassword.isPending}
									className="btn-playful"
								>
									{changePassword.isPending ? (
										<>
											<Loader2 className="size-4 mr-2 animate-spin" />
											Updating...
										</>
									) : (
										<>
											<KeyRound className="size-4 mr-2" />
											Update Password
										</>
									)}
								</Button>
							</div>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}