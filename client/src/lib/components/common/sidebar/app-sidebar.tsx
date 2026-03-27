"use client";

import AppSidebarHeader from "@/lib/components/common/sidebar/sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/lib/components/ui/sidebar";
import {
  CompassIcon,
  Handshake,
  History,
  HouseHeart,
  Pencil,
  ShieldUser,
  TrendingUp,
} from "lucide-react";
import * as React from "react";

import FeedbackButton from "@/lib/components/common/feedback-button";
import NavMain, { type NavSection } from "./nav-main";
import { NavUser } from "./nav-user";

const sections: NavSection[] = [
  {
    label: "Today",
    items: [
      { title: "Home", url: "/home", icon: HouseHeart, role: "User" },
      { title: "Check-in", url: "/home/checkin", icon: Pencil, role: "User" },
      { title: "History", url: "/home/history", icon: History, role: "User" },
    ],
  },
  {
    label: "Connect & grow",
    items: [
      { title: "Community", url: "/home/community", icon: Handshake, role: "User" },
      { title: "Explore", url: "/home/explore", icon: CompassIcon, role: "User" },
      { title: "Trends", url: "/home/trends", icon: TrendingUp, role: "User" },
    ],
  },
  {
    items: [
      { title: "Admin", url: "/admin/content", icon: ShieldUser, role: "Admin" },
    ],
  },
];

type SidebarLayoutProps = React.ComponentProps<typeof Sidebar> & {};

export default function AppSidebar({ ...props }: SidebarLayoutProps) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/80 bg-sidebar/95 backdrop-blur-sm"
      {...props}
    >
      <SidebarHeader className="h-14 min-h-14 shrink-0 flex-row items-center gap-0 border-b border-sidebar-border/60 px-2 py-0 group-data-[collapsible=icon]:border-sidebar-border/40 group-data-[collapsible=icon]:px-1.5">
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent className="gap-5 px-2 py-3 group-data-[collapsible=icon]:gap-3 group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:py-2">
        <NavMain sections={sections} />
      </SidebarContent>
      <SidebarFooter className="gap-2 border-t border-sidebar-border/60 pt-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:pt-2">
        <FeedbackButton />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
