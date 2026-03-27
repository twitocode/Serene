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
      <SidebarHeader className="border-b border-sidebar-border/60 pb-3">
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent className="gap-6 px-2 py-4">
        <NavMain sections={sections} />
      </SidebarContent>
      <SidebarFooter className="gap-3 border-t border-sidebar-border/60 pt-3">
        <FeedbackButton />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
