<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { User } from "$lib/types";

	const { isSignup = false, user } = $props<{ isSignup?: boolean, user?: User }>();
</script>

<nav class={`flex navbar pt-10 px-10 ${isSignup ? "" : "md:px-96"}`}>
	<div class="flex-1">
		<a href="/" class="text-xl">
			Serene
		</a>
	</div>
	<div class="md:space-x-2">
    {#if user}
      <Button variant="default" href="/home">
        Go to Serene
      </Button>
    {:else}
       	<Button variant="default" href="/signup">
			Sign up
		</Button>
		<Button variant="ghost" href="/login">
			Or login
		</Button>
    {/if}
	
	</div>
</nav>
