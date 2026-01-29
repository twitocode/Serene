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
import NavMain from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    image: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Home", url: "/home", icon: HouseHeart, role: "User" },
    {
      title: "Checkin",
      url: "/home/checkin",
      icon: Pencil,
      isActive: true,
      role: "User",
    },
    {
      title: "Community",
      url: "/home/community",
      icon: Handshake,
      role: "User",
    },
    { title: "Explore", url: "/home/explore", icon: CompassIcon, role: "User" },
    { title: "Trends", url: "/home/trends", icon: TrendingUp, role: "User" },
    { title: "History", url: "/home/history", icon: History, role: "User" },
    { title: "Admin", url: "/admin/content", icon: ShieldUser, role: "Admin" },
  ],
};

type SidebarLayoutProps = React.ComponentProps<typeof Sidebar> & {};

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
        <FeedbackButton />

        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
