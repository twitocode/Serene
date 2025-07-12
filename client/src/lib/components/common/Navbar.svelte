<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	const { isSignup = false } = $props<{ isSignup?: boolean }>();
</script>

<nav class={`flex navbar pt-10 px-10 ${isSignup ? "" : "md:px-96"}`}>
	<div class="flex-1">
		<a href="/" class="text-xl">
			Serene
		</a>
	</div>
	<div class="md:space-x-2">
		<Button variant="default" href="/signup">
			Sign up
		</Button>
		<Button variant="ghost" href="/login">
			Or login
		</Button>
	</div>
</nav>
