"use client";

import SereneLogo from "@/lib/components/common/serene-logo";
import { SidebarMenu, SidebarMenuItem } from "@/lib/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function SidebarMenuComponent() {
	return (
		<SidebarMenu className="gap-0">
			<SidebarMenuItem
				className={cn(
					"flex min-h-0 min-w-0 flex-1 items-center gap-2 rounded-xl px-0 py-0",
					"group-data-[collapsible=icon]:justify-center",
				)}
			>
				<div
					className={cn(
						"flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 ring-1 ring-primary/15",
						"group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:shrink-0",
					)}
				>
					<SereneLogo noText sidebar />
				</div>
				<div
					className={cn(
						"min-w-0 flex-1 text-left leading-tight",
						"group-data-[collapsible=icon]:hidden",
					)}
				>
					<SereneLogo noLogo textSize="text-base" />
					<p className="truncate text-[10px] leading-tight text-muted-foreground">
						Mental wellness for students
					</p>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
