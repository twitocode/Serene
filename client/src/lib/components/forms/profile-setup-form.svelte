<script lang="ts">
	import { type SetupProfileSchema } from "$lib/components/auth/formSchema";
	import DatePicker from "$lib/components/forms/date-picker.svelte";
	import FormSelect from "$lib/components/forms/form-select.svelte";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { constants } from "$lib/constants";
	import type { User } from "$lib/types";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import { getContext } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import SuperDebug, { superForm, type SuperValidated } from "sveltekit-superforms";
	import type { Infer } from "zod/v4";

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		formProps: SuperValidated<Infer<SetupProfileSchema>>;
		SERVER_URL: string;
		IS_DEVELOPMENT: boolean;
	};

	let { class: className, formProps, SERVER_URL, IS_DEVELOPMENT, ...restProps }: Props = $props();

  const user = getContext<User>("user")
	const id = $props.id();
	let loadingFormResult = $state(false);

	const form = superForm(formProps, {});
	const { form: formData, errors, constraints, message, enhance } = form;


</script>

{#if $message}<h3>{$message}</h3>{/if}

<form method="POST" use:enhance class={cn("flex flex-col gap-6", className)}>
	<div class="flex flex-col gap-6">
		<div class="flex flex-col items-center gap-2">
			<a href="##" class="flex flex-col items-center gap-2 font-medium">
				<div class="flex size-8 items-center justify-center rounded-md">
					<GalleryVerticalEndIcon class="size-6" />
				</div>
				<span class="sr-only">Serene</span>
			</a>
			<h1 class="text-xl font-bold">Finish Setting up your Profile</h1>
		</div>
		<div class="grid gap-1 md:grid-cols-2">
			<div class="flex flex-col gap-6">
				<div class="flex flex-col gap-2">
					<Form.Field {form} name="firstName">
						<Form.Control>
							{#snippet children({ props }: any)}
								<div class="flex flex-col gap-2 md:flex-row md:gap-0">
									<div class="flex-1/4">
										<Form.Label class="text-wrap">First Name</Form.Label>
										<Form.Description></Form.Description>
									</div>
									<Input
										placeholder="Jane"
										class="flex-3/4"
										{...props}
										bind:value={$formData.firstName}
									/>
								</div>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="lastName">
						<Form.Control>
							{#snippet children({ props }: any)}
								<div class="flex flex-col gap-2 md:flex-row md:gap-0">
									<div class="flex-1/4">
										<Form.Label>Last Name</Form.Label>
										<Form.Description></Form.Description>
									</div>
									<Input
										placeholder="Doe"
										class="flex-3/4"
										{...props}
										bind:value={$formData.lastName}
									/>
								</div>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<Form.Field {form} name="username">
						<Form.Control>
							{#snippet children({ props }: any)}
								<div class="flex flex-col gap-2 md:flex-row md:gap-0">
									<div class="flex-1/4">
										<Form.Label>Username</Form.Label>
										<Form.Description></Form.Description>
									</div>
									<Input
										placeholder="John"
										class="flex-3/4"
										{...props}
										bind:value={$formData.username}
									/>
								</div>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
					<div class="grid grid-cols-2 gap-2">
						<Form.Field {form} name="dateOfBirth">
							<Form.Control>
								{#snippet children({ props }: any)}
									<div class="flex flex-col">
										<div class="flex flex-col gap-2">
											<Form.Label>Date of Birth</Form.Label>
											<Input class="hidden" {...props} bind:value={$formData.dateOfBirth} name="dateOfBirth"/>
											<DatePicker bind:value={$formData.dateOfBirth} />
											<Form.Description>Helps to determine age specific resources</Form.Description>
										</div>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="country">
							<Form.Control>
								{#snippet children({ props }: any)}
									<div class="flex flex-col">
										<div class="flex flex-col gap-2">
											<Form.Label>Country</Form.Label>
											<FormSelect bind:value={$formData.country} name="country" items={constants.countries} />
											<Form.Description
												>Helps to determine country specific resources</Form.Description
											>
										</div>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="gender">
							<Form.Control>
								{#snippet children({ props }: any)}
									<div class="flex flex-col">
										<div class="flex flex-col gap-2">
											<Form.Label>Gender</Form.Label>
											<FormSelect bind:value={$formData.gender}  name="gender" items={constants.genders} />
										</div>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="pronouns">
							<Form.Control>
								{#snippet children({ props }: any)}
									<div class="flex flex-col">
										<div class="flex flex-col gap-2">
											<Form.Label>Pronouns</Form.Label>
											<FormSelect bind:value={$formData.pronouns}  name="pronouns" items={constants.pronouns} />
										</div>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>
				</div>
			</div>
			<div>
        
        <img src={$formData.avatarUrl} alt="">
      </div>
			<Form.Button type="submit" class="w-full">Complete!</Form.Button>
		</div>
	</div>
</form>

{#if IS_DEVELOPMENT}
	<SuperDebug data={$formData} />
{/if} 

<style>
	.invalid {
		color: var(--color-red-500);
	}
</style>
