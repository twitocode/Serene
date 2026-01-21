"use client";

import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";
import Link from "next/link";

import SereneLogo from "@/lib/components/common/serene-logo";
import { Button } from "@/lib/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/lib/components/ui/navigation-menu";
import { useIsMobile } from "@/lib/hooks/use-mobile";

export function Navbar() {
  const isMobile = useIsMobile();

  return (
    <nav className="flex justify-between w-full items-center">
      <div>
        <Link href="/" >
          <SereneLogo />
        </Link>
      </div>
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList className="flex-wrap">
        
          <NavigationMenuItem>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
