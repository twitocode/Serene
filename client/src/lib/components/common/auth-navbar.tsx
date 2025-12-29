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
    <nav className="flex justify-between w-full items-center">
      <div>
        <Link href="/" className="hover:opacity-75">
          <SereneLogo />
        </Link>
      </div>
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList>
          <NavigationMenuItem>
            {pathname == "/login" ? (
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
