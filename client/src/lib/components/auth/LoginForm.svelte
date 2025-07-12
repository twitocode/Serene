<script lang="ts">
	import { type SuperForm } from 'sveltekit-superforms';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import DiscordIcon from '$lib/components/auth/DiscordIcon.svelte';
	import GoogleIcon from '$lib/components/auth/GoogleIcon.svelte';
	import { Input } from '$lib/components/ui/input';

	let { formProps } = $props<{ formProps: SuperForm<any, any> }>();

	// Client API:
	const { form, errors, constraints, message, enhance } = formProps;
</script>

{#if $message}<h3>{$message}</h3>{/if}

<div class="flex flex-col gap-6">
	<Card class="overflow-hidden py-0">
		<CardContent class="grid md:grid-cols-2 p-0">
			<form method="POST" class="p-6 md:p-8" use:enhance>
				<div class="flex flex-col gap-6">
					<div class="flex flex-col items-center text-center">
						<h1 class="text-2xl font-bold">Welcome back</h1>
						<p class="text-balance text-muted-foreground">
							Login to Serene
						</p>
					</div>
					<div class="grid gap-2">
						<label for="email">Email</label>
						<Input
							name="email"
							id="email"
							type="email"
							placeholder="m@example.com"

							aria-invalid={$errors.email ? 'true' : undefined}
							bind:value={$form.email}
							{...$constraints.email} />
						{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<label for="password">Password</label>
							<a
								href="#"
								class="ml-auto text-sm underline-offset-2 hover:underline"
							>
								Forgot your password?
							</a>
						</div>
						<Input
							name="password"
							id="password"
							type="password"

							aria-invalid={$errors.password ? 'true' : undefined}
							bind:value={$form.password}
							{...$constraints.password} />
						{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
					</div>
					<Button type="submit" class="w-full">
						Login
					</Button>
					<div
						class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span class="relative z-10 px-2 text-muted-foreground">
                  Or continue with
                </span>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<Button variant="outline" class="w-full">
							<DiscordIcon />
							<span class="sr-only">Login with Discord</span>
						</Button>
						<Button variant="outline" class="w-full">
							<GoogleIcon />
							<span class="sr-only">Login with Google</span>
						</Button>
					</div>
					<div class="text-center text-sm">
						Don&apos;t have an account?{" "}
						<a href="/signup" class="underline underline-offset-4">
							Sign up
						</a>
					</div>
				</div>
			</form>
			<div
				class="relative hidden bg-muted md:block p-0 m-0"
				id="signup-image"
			></div>
		</CardContent>
	</Card>
	<div
		class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
		By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
		and <a href="#">Privacy Policy</a>.
	</div>
</div>

<style>
    .invalid {
        color: red;
    }
</style>