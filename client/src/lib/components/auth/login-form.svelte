<script lang="ts">
	import { loginSchema, signUpSchema, type LoginFormSchema } from "$lib/components/auth/formSchema";
	import GoogleIcon from "$lib/components/auth/google-icon.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import type { HTMLAttributes } from "svelte/elements";
	import SuperDebug, { superForm, type SuperValidated } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import type { Infer } from "zod/v4";
import { page } from '$app/stores';  

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		formProps: SuperValidated<Infer<LoginFormSchema>>;
		SERVER_URL: string;
		IS_DEVELOPMENT: boolean;
		isLogin?: boolean;
	};

	let {
		class: className,
		formProps,
		SERVER_URL,
		isLogin = false,
		IS_DEVELOPMENT,
		...restProps
	}: Props = $props();

	const id = $props.id();

	// Client API:
	const form = superForm(formProps, {
		validators: zod4Client(isLogin ? loginSchema : signUpSchema)
	});

	const { form: formData, errors, constraints, message, enhance } = form;

  const origin = $page.url.origin;
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
			<h1 class="text-xl font-bold">
				{#if isLogin}
					Login to Serene
				{:else}
					Sign Up for Serene
				{/if}
			</h1>
			{#if isLogin}
				<div class="text-center text-sm">
					Don&apos;t have an account?
					<a href="/signup" class="underline underline-offset-4"> Sign up </a>
				</div>
			{:else}
				<div class="text-center text-sm">
					Already have an account?
					<a href="/login" class="underline underline-offset-4"> Login </a>
				</div>
			{/if}
		</div>
		<div class="flex flex-col gap-6">
			<div class="grid gap-3">
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props }: any)}
							<Form.Label>Email</Form.Label>
							<Input placeholder="me@example.com" {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.Description>The email you will use for logging in</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="grid gap-3">
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props }: any)}
							<Form.Label>Password</Form.Label>
							<Input placeholder="" {...props} bind:value={$formData.password} />
						{/snippet}
					</Form.Control>
					<Form.Description>What you'll be using to secure your account</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Button type="submit" class="w-full"
				>{#if isLogin}
					Login
				{:else}
					Sign Up
				{/if}</Form.Button
			>
		</div>
		<div
			class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
		>
			<span class="bg-background text-muted-foreground relative z-10 px-2"> Or </span>
		</div>
		<div class="grid gap-4">
			<Button
				variant="outline"
				type="button"
				class="w-full"
				href={`${SERVER_URL}/auth/login/google?returnUrl=${origin}/login/callback`}
			>
				<GoogleIcon />
				Continue with Google
			</Button>
		</div>
	</div>
	<div
		class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"
	>
		By clicking continue, you agree to our <a href="##">Terms of Service</a>
		and <a href="##">Privacy Policy</a>.
	</div>
</form>
{#if IS_DEVELOPMENT}
	<SuperDebug data={form} />
{/if}

<style>
	.invalid {
		color: var(--color-red-500);
	}
</style>
