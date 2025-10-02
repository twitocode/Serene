<script lang="ts">
	import AppSidebar from "@/lib/components/app-sidebar.svelte";
	import * as Sidebar from "@/lib/components/ui/sidebar/index.js";
	import type { User } from "@/lib/types";
	import { setContext, type Snippet } from "svelte";
	import type { LayoutProps } from "./$types";

	let { children, data }: LayoutProps   = $props();

	setContext('user', data.user)
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header
			class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
			</div>
		</header>
    <div class="flex flex-1 flex-col gap-4 pt-4 px-40">
      {@render children()}  
    </div>
    
	</Sidebar.Inset>
</Sidebar.Provider>
