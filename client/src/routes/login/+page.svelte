<script lang="ts">
	import LoginForm from "$lib/components/auth/login-form.svelte";
	import SuperDebug, { superForm } from "sveltekit-superforms";

	let { data } = $props();

	// Client API:
	const formProps = $state(data.form);
  const {SERVER_URL, IS_DEVELOPMENT } = data;
</script>

<div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
	<div class="w-full max-w-sm">
		<LoginForm {formProps} {SERVER_URL} {IS_DEVELOPMENT} isLogin />
	</div>
</div>
