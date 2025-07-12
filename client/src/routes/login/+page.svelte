<script>
	import LoginForm from '$lib/components/auth/LoginForm.svelte';

	import SuperDebug, { superForm } from 'sveltekit-superforms';

	let { data } = $props();

	// Client API:
	const formProps = superForm(data.form);
	const form = $state(data.form);
</script>

<div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
	<div class="w-full max-w-sm md:max-w-3xl">
		<LoginForm {formProps} />
	</div>
</div>
<SuperDebug data={form} />