<script lang="ts" module>
	import { Home, Library, ListMusic, Pencil, TrendingUp } from "@lucide/svelte/icons";

	const data = $derived({
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg"
		},
		navMain: [
      {
        title: "Home",
        url: "/home",
        icon: Home
      },
			{
				title: "Reflect",
				url: "/home/reflect",
				icon: Pencil,
				isActive: true
			},
			{
				title: "Ambience",
				url: "/home/ambience",
				icon: ListMusic
			},
			{
				title: "Trends",
				url: "/home/trends",
				icon: TrendingUp
			},
			{
				title: "Content Library",
				url: "/home/library",
				icon: Library
			}
		]
	});
</script>

<script lang="ts">
  



	import * as Sidebar from "@/lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import SidebarHeader from "./sidebar-header.svelte";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root>  = $props();
</script>

<Sidebar.Root {collapsible} {...restProps} class="border-sidebar-primary">
	<Sidebar.Header>
		<SidebarHeader />
	</Sidebar.Header>
	<Sidebar.Content class="flex flex-col h-full justify-center">
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser />
	</Sidebar.Footer>
</Sidebar.Root>
