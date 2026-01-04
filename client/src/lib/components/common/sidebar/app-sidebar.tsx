"use client";

import AppSidebarHeader from "@/lib/components/common/sidebar/sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/lib/components/ui/sidebar";
import { CompassIcon, Handshake, History, Home, HouseHeart, Library, ListMusic, Navigation2, Pencil, TrendingUp } from "lucide-react";
import * as React from "react";

import NavMain from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    image: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Home", url: "/home", icon: HouseHeart },
    { title: "Checkin", url: "/home/checkin", icon: Pencil, isActive: true },
    { title: "Community", url: "/home/community", icon: Handshake },
    { title: "Explore", url: "/home/explore", icon: CompassIcon },
    { title: "Trends", url: "/home/trends", icon: TrendingUp },
    { title: "History", url: "/home/history", icon: History },
  ],
};

type SidebarLayoutProps = React.ComponentProps<typeof Sidebar> & {
};

export default function AppSidebar({ ...props }: SidebarLayoutProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent className="flex flex-col items-center h-full justify-center">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  );
}
