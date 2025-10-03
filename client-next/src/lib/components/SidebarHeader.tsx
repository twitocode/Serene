// SidebarMenu.tsx
"use client";

import SereneLogo from "@/lib/components/common/SereneLogo"; // React version of your logo
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <SereneLogo noText sidebar />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
              <SereneLogo noLogo/>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
