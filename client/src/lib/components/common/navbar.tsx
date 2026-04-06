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

export function Navbar() {
	const isMobile = useIsMobile();

	return (
		<nav className="flex w-full items-center justify-between gap-4 py-2">
			<Link href="/" className="min-w-0 shrink">
				<SereneLogo />
			</Link>
			<NavigationMenu viewport={isMobile}>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href="/login">
							<Button variant="" size="sm" className="font-bold">
								Log in
							</Button>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</nav>
	);
}
