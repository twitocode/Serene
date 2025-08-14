<script lang="ts" module>
	import { Library, ListMusic, Pencil, TrendingUp } from "@lucide/svelte/icons";

	const data = $derived({
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg"
		},
		navMain: [
			{
				title: "Reflect",
				url: "#",
				icon: Pencil,
				isActive: true
			},
			{
				title: "Ambience",
				url: "#",
				icon: ListMusic
			},
			{
				title: "Trends",
				url: "#",
				icon: TrendingUp
			},
			{
				title: "Content Library",
				url: "#",
				icon: Library
			}
		]
	});
</script>

<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import TeamSwitcher from "./team-switcher.svelte";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
