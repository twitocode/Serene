"use client";

import { useForm } from "@tanstack/react-form";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/lib/components/ui/avatar";
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
import {
	useUpdateProfileMutation,
	useUserQuery,
} from "@/lib/hooks/queries/use-user";

export function ProfileSettings() {
	const { data: user, isLoading: userLoading } = useUserQuery();
	const updateProfile = useUpdateProfileMutation();

	const profileForm = useForm({
		defaultValues: {
			name: user?.name ?? "",
		},
		onSubmit: async ({ value }) => {
			try {
				await updateProfile.mutateAsync({ name: value.name });
				toast.success("Profile updated successfully!");
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Failed to update profile",
				);
			}
		},
	});

	if (userLoading) {
		return (
			<div className="flex items-center justify-center p-8">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<Card className="card-organic border-0 shadow-lg">
			<CardHeader className="pb-4">
				<CardTitle className="text-xl">Profile Details</CardTitle>
				<CardDescription>
					Update your personal information and how others see you
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
					<Avatar className="size-20 ring-4 ring-primary/10">
						<AvatarImage
							src={user?.image ?? undefined}
							alt={user?.name ?? "User"}
						/>
						<AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
							{user?.name?.charAt(0) ?? user?.email?.charAt(0) ?? "U"}
						</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="font-semibold text-foreground">
							{user?.name || "No name set"}
						</h3>
						<p className="text-sm text-muted-foreground">{user?.email}</p>
					</div>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						profileForm.handleSubmit();
					}}
				>
					<FieldGroup>
						<profileForm.Field name="name">
							{(field) => (
								<Field>
									<FieldLabel htmlFor="name">Display Name</FieldLabel>
									<FieldDescription>
										This is the name that will be displayed to others
									</FieldDescription>
									<Input
										id="name"
										placeholder="Enter your name"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										className="max-w-md"
									/>
									{field.state.meta.errors.length > 0 && (
										<FieldError>
											{field.state.meta.errors.join(", ")}
										</FieldError>
									)}
								</Field>
							)}
						</profileForm.Field>

						<div className="pt-4">
							<Button
								type="submit"
								disabled={updateProfile.isPending}
								className="btn-playful"
							>
								{updateProfile.isPending ? (
									<>
										<Loader2 className="size-4 mr-2 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Check className="size-4 mr-2" />
										Save Changes
									</>
								)}
							</Button>
						</div>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
