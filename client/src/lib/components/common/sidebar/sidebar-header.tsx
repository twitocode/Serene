// SidebarMenu.tsx
"use client";

import SereneLogo from "@/lib/components/common/serene-logo"; // React version of your logo
import { ThemeToggle } from "@/lib/components/common/theme-toggle";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/lib/components/ui/sidebar"; // React version of your sidebar
import { useIsMobile } from "@/lib/hooks/use-mobile";

export default function SidebarMenuComponent() {
  const sidebar = useSidebar();
  const isMobile = useIsMobile();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <SereneLogo noText sidebar />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <SereneLogo noLogo />
          </div>
          <div>
            <ThemeToggle />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
