<script lang="ts">
	import type { User } from "@/lib/types";
	import { setContext } from 'svelte'

  let {children} = $props()
</script>
{@render children()}