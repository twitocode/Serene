// SidebarMenu.tsx
"use client";

import React from "react";
import SereneLogo from "@/lib/components/common/SereneLogo"; // React version of your logo
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/lib/components/ui/sidebar"; // React version of your sidebar
import { Ribbon, ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react";

export default function SidebarMenuComponent() {
  const sidebar = useSidebar();

  return (
    <Sidebar>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <a href="/home">
              <SereneLogo />
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
}