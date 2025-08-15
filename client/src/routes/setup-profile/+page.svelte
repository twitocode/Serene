<script lang="ts">
	import LoginForm from "$lib/components/auth/login-form.svelte";
	import ProfileSetupForm from "$lib/components/forms/profile-setup-form.svelte";

	let { data } = $props();

	// Client API:
	const formProps = $derived(data.form);
  const {SERVER_URL, IS_DEVELOPMENT } = data;
</script>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-4xl">
		<ProfileSetupForm {formProps} {SERVER_URL} {IS_DEVELOPMENT} />
	</div>
</div>
