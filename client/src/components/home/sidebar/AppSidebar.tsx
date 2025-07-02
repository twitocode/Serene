"use client";
import { Library, ListMusic, Pencil, TrendingUp } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "./NavUser";

const titleItem = {
  url: "/home",
};
// Menu items.
const items = [
  {
    title: "Reflect",
    url: "/home/reflect",
    icon: Pencil,
  },
  {
    title: "Trends",
    url: "/home/trends",
    icon: TrendingUp,
  },
  {
    title: "Library",
    url: "/home/library",
    icon: Library,
  },
  {
    title: "Ambience",
    url: "/home/ambience",
    icon: ListMusic,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5 flex"
              >
                <Link href={titleItem.url}>
                  <span className="text-xl font-semibold font-noto">
                    Serene
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: "Twito",
              avatar: "blob:null/bd2767f6-7236-421b-b523-d338a78c688f",
              email: "twitodev@gmail.com",
            }}
          />
        </SidebarFooter>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
