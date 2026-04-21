"use client";

import { ArrangeVertical, Logout, TickCircle } from "iconsax-reactjs";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/lib/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/lib/components/ui/sidebar";
import { useUserQuery } from "@/lib/hooks/queries/use-user";

type NavUserProps = {
	isMobile?: boolean;
};

export function NavUser({}: NavUserProps) {
	const sidebar = useSidebar();
	const { data: user } = useUserQuery();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="size-8 rounded-lg">
								<AvatarImage
									src={user?.image ?? "/user.svg"}
									alt={`${user?.name}'s image`}
								/>
								<AvatarFallback className="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user?.name}</span>
								<span className="truncate text-xs">{user?.email}</span>
							</div>
							<span className="ml-auto size-4 flex items-center justify-center">
								<ArrangeVertical
									variant="Bulk"
									size={16}
									color="currentColor"
								/>
							</span>
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg font-sans"
						side={sidebar.isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="size-8 rounded-lg">
									<AvatarImage
										src={user?.image ?? "/user.svg"}
										alt={`${user?.name}'s image`}
									/>
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user?.name}</span>
									<span className="truncate text-xs">{user?.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<Link
								href="/home/account"
								onClick={() => sidebar.isMobile && sidebar.setOpenMobile(false)}
							>
								<DropdownMenuItem>
									<span className="mr-2 size-4 flex items-center justify-center">
										<TickCircle variant="Bulk" size={16} color="currentColor" />
									</span>
									Account Settings
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem
							onClick={async () => {
								await auth.signOut();
								window.location.href = "/";
							}}
						>
							<span className="mr-2 size-4 flex items-center justify-center">
								<Logout variant="Bulk" size={16} color="currentColor" />
							</span>
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
