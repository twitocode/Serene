"use client";

import SereneLogo from "@/lib/components/common/serene-logo";
import { SidebarMenu, SidebarMenuItem } from "@/lib/components/ui/sidebar";

export default function SidebarMenuComponent() {
  return (
    <SidebarMenu className="gap-0">
      <SidebarMenuItem className="flex items-center gap-3 rounded-xl px-1 py-0.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
          <SereneLogo noText sidebar />
        </div>
        <div className="min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
          <SereneLogo noLogo textSize="text-lg" />
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            Mental wellness for students
          </p>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
