<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { useSidebar } from "$lib/components/ui/sidebar/index.js";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import PlusIcon from "@lucide/svelte/icons/plus";

	let { subscriptionStatus }: { subscriptionStatus: { name: string; logo: any; plan: string }[] } =
		{
			subscriptionStatus: [
				{
					name: "Serene",
					logo: GalleryVerticalEndIcon,
					plan: "Normal"
				},
				{
					name: "Serene",
					logo: GalleryVerticalEndIcon,
					plan: "Pro"
				}
			]
		};
	const sidebar = useSidebar();

	let activeSubscriptionType = $state(subscriptionStatus[0]);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<activeSubscriptionType.logo class="size-4" />
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">
								{activeSubscriptionType.name}
							</span>
							<span class="truncate text-xs">{activeSubscriptionType.plan}</span>
						</div>
						<ChevronsUpDownIcon class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? "bottom" : "right"}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-muted-foreground text-xs"
					>subscriptionStatus</DropdownMenu.Label
				>
				{#each subscriptionStatus as team, index (team.name)}
					<DropdownMenu.Item onSelect={() => (activeSubscriptionType = team)} class="gap-2 p-2">
						<div class="flex size-6 items-center justify-center rounded-md border">
							<team.logo class="size-3.5 shrink-0" />
						</div>
						{team.name}
						<DropdownMenu.Shortcut>⌘{index + 1}</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2">
					<div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
						<PlusIcon class="size-4" />
					</div>
					<div class="text-muted-foreground font-medium">Add team</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
