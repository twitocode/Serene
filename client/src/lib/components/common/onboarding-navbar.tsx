"use client";

import Link from "next/link";

import SereneLogo from "@/lib/components/common/serene-logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/lib/components/ui/navigation-menu";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { usePathname } from "next/navigation";

export function OnBoardingNavbar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <nav className="flex justify-between w-full items-center">
      <div>
        <Link href="/" className="hover:opacity-75">
          <SereneLogo textSize="4xl" iconSize={40}/>
        </Link>
      </div>
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList>
          <NavigationMenuItem></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
