<script lang="ts">
	import * as Select from "$lib/components/ui/select/index.js";

	type Props = {
		name: string;
    value: string;
		items: {
			value: string;
			label: string;
		}[];
	};

	let { name, items, value = $bindable("") }: Props = $props();

	const triggerContent = $derived(
		items.find((f) => f.value === value)?.label ?? `Select a ${name}`
	);
</script>

<Select.Root type="single" {name} bind:value>
	<Select.Trigger class="w-full">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>items</Select.Label>
			{#each items as item (item.value)}
				<Select.Item value={item.value} label={item.label}>
					{item.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
