"use client";

import Link from "next/link";

import { authClient } from "@/lib/auth";
import SereneLogo from "@/lib/components/common/serene-logo";
import { Button } from "@/lib/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/lib/components/ui/navigation-menu";
import { useIsMobile } from "@/lib/hooks/use-mobile";

interface Props {
  user: {
    name: string;
  };
}

export function OnBoardingNavbar({ user }: Props) {
  const isMobile = useIsMobile();

  const logout = () => {
    authClient.signOut();
    //TODO: add a loading spinner
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between w-full items-center">
      <div>
        <Link href="/" className="hover:opacity-75">
          <SereneLogo textSize="4xl" iconSize={40} />
        </Link>
      </div>
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList>
          <NavigationMenuItem className="space-x-4">
            <span>Signed in as {user.name}</span> 
            <Button onClick={logout}>Logout</Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
