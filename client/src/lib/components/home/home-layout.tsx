"use client";
import { Lock, MedalStar } from "iconsax-reactjs";
import { motion } from "motion/react";
import type { PropsWithChildren } from "react";
import { MochiWhisper } from "@/lib/components/common/mochi-whisper";
import AppSidebar from "@/lib/components/common/sidebar/app-sidebar";
import { ThemeToggle } from "@/lib/components/common/theme-toggle";
import { Button } from "@/lib/components/ui/button";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/lib/components/ui/sidebar";
import { useSettingsQuery } from "@/lib/hooks/queries/use-settings";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import { usePasswordLockStore } from "@/lib/hooks/stores/lock-store";

export default function HomeLayout({ children }: PropsWithChildren) {
	const { setLockState, isLocked } = usePasswordLockStore();
	const { data: settings } = useSettingsQuery();
	const { data: user } = useUserQuery();

	return !isLocked ? (
		<SidebarProvider className="h-svh overflow-hidden">
			<AppSidebar />
			<SidebarInset className="relative flex h-full flex-col overflow-hidden">
				<div
					className="pointer-events-none absolute inset-0 -z-10 mesh-sanctuary opacity-90"
					aria-hidden
				/>
				<header className="flex h-14 min-h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-3 backdrop-blur-md md:px-4">
					<SidebarTrigger className="-ml-0.5 text-muted-foreground hover:text-foreground md:hidden" />
					<div className="flex-1"></div>
					<div className="flex shrink-0 items-center gap-2">
						<motion.div
							key={user?.profile?.currentStreak}
							initial={{ scale: 1 }}
							animate={{
								scale: [1, 1.15, 1],
								rotate: [0, -5, 5, 0],
							}}
							transition={{
								duration: 0.5,
								ease: "backOut",
							}}
							className="pill-interactive flex h-8 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 text-primary shadow-sm"
						>
							<MedalStar variant="Bulk" size={14} color="currentColor" />
							<span className="text-xs font-semibold tabular-nums">
								{user?.profile?.currentStreak ?? 0}{" "}
								<span className="font-normal text-primary/80">day streak</span>
							</span>
						</motion.div>
						<ThemeToggle />
						{!!settings?.passwordLock && (
							<Button
								className="rounded-full sm:inline-flex"
								variant="outline"
								size="sm"
								onClick={() => {
									setLockState(true);
								}}
							>
								<Lock variant="Bulk" size={16} color="currentColor" />
								Lock
							</Button>
						)}
					</div>
				</header>
				<div className="relative flex-1 overflow-y-auto">{children}</div>
				<MochiWhisper />
			</SidebarInset>
		</SidebarProvider>
	) : (
		<></>
	);
}
