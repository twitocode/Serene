"use client";

import AppSidebarHeader from "@/lib/components/common/sidebar/sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/lib/components/ui/sidebar";
import { Home, Library, ListMusic, Pencil, TrendingUp } from "lucide-react";
import * as React from "react";

import { User } from "@/lib/types";
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    image: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Home", url: "/home", icon: Home },
    { title: "Reflect", url: "/home/reflect", icon: Pencil, isActive: true },
    { title: "Ambience", url: "/home/ambience", icon: ListMusic },
    { title: "Trends", url: "/home/trends", icon: TrendingUp },
    { title: "Content Library", url: "/home/library", icon: Library },
  ],
};

type SidebarLayoutProps = React.ComponentProps<typeof Sidebar> & {
  user: User;
};

export default function AppSidebar({ user, ...props }: SidebarLayoutProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent className="flex flex-col items-center h-full justify-center">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
