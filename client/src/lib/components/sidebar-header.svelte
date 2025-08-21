<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { useSidebar } from "$lib/components/ui/sidebar/index.js";
	import { Ribbon } from "@lucide/svelte";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import PlusIcon from "@lucide/svelte/icons/plus";

	const sidebar = useSidebar();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem >
		<Sidebar.MenuButton size="lg">
			{#snippet child({ props })}
				<a href="##" {...props}>
					<div
						class="text-sidebar-primary flex aspect-square items-center justify-center rounded-lg"
					>
						<Ribbon  />
					</div>
          <span class="font-medium">Serene</span>
				</a>
			{/snippet}
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
</Sidebar.Menu>
