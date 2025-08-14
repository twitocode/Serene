<script lang="ts">
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import LoginForm from "$lib/components/auth/login-form.svelte";
	import SuperDebug, { superForm } from "sveltekit-superforms";

	let { data } = $props();

	// Client API:
	const formProps = data.form;
  const {SERVER_URL, IS_DEVELOPMENT } = data;
</script>

<div class="grid min-h-svh lg:grid-cols-2">
	<div class="flex flex-col gap-4 p-6 md:p-10">
		<div class="flex justify-center gap-2 md:justify-start">
			<a href="##" class="flex items-center gap-2 font-medium">
				<div
					class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
				>
					<GalleryVerticalEndIcon class="size-4" />
				</div>
				Serene
			</a>
		</div>
		<div class="flex flex-1 items-center justify-center">
			<div class="w-full max-w-xs">
				<LoginForm {formProps} {SERVER_URL} {IS_DEVELOPMENT} />
			</div>
		</div>
	</div>
	<div class="bg-muted relative hidden lg:block">
		<img
			src="https://i.pinimg.com/736x/47/6f/43/476f43c454ab1ca44e1ad5dd1a001d3f.jpg"
			alt="placeholder"
			class="absolute inset-0 h-full w-full object-cover"
		/>
	</div>
</div>

