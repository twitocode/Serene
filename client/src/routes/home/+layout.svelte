<script lang="ts">
	import type { User } from "$lib/types";
	import { setContext } from 'svelte'

	let { user: data } = $props<{ user: User }>()
	let user = $state(data)

	$effect(() => {
    user.name = data.user.name
	})

	setContext('user', user)
</script>