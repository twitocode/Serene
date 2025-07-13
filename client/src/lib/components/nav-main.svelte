<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";

	let {
		items
	}: {
		items: {
			title: string;
			url: string;
			// this should be `Component` after @lucide/svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
			}[];
		}[];
	} = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as item (item.title)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton tooltipContent={item.title}>
					{#if item.icon}
						<item.icon />
					{/if}
					<span>{item.title}</span>
				</Sidebar.MenuButton>
				<Sidebar.MenuSub>
					{#each item.items ?? [] as subItem (subItem.title)}
						<Sidebar.MenuSubItem>
							<Sidebar.MenuSubButton>
								{#snippet child({ props })}
									<a href={subItem.url} {...props}>
										<span>{subItem.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuSubButton>
						</Sidebar.MenuSubItem>
					{/each}
				</Sidebar.MenuSub>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
