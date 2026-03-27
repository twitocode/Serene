"use client";

import Link from "next/link";

import SereneLogo from "@/lib/components/common/serene-logo";
import { Button } from "@/lib/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/lib/components/ui/navigation-menu";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { usePathname } from "next/navigation";

export function AuthNavbar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <nav className="flex w-full items-center justify-between gap-4 py-2">
      <Link href="/" className="hover:opacity-90">
        <SereneLogo />
      </Link>
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList>
          <NavigationMenuItem>
            {pathname === "/login" ? (
              <Link href="/signup">
                <Button size="sm" className="font-medium">
                  Sign up
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm" className="font-medium">
                  Log in
                </Button>
              </Link>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
