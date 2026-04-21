"use client";

import { Cup } from "iconsax-reactjs";
import { motion } from "motion/react";
import Link from "next/link";
import { useAchievementsQuery } from "@/lib/hooks/queries/use-achievements";

export default function RecentBadges() {
	const { data: achievements = [] } = useAchievementsQuery();

	const recent = achievements
		.filter((a) => a.unlocked)
		.sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? ""))
		.slice(0, 3);

	if (recent.length === 0) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
			className="space-y-3"
		>
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
					Recent badges
				</h3>
				<Link
					href="/home/achievements"
					className="text-xs font-medium text-primary hover:underline"
				>
					View all
				</Link>
			</div>
			<div className="flex flex-wrap gap-2">
				{recent.map((a) => (
					<div
						key={a.id}
						className="pill-interactive flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 cursor-default"
					>
						<Cup variant="Bulk" size={12} color="currentColor" />
						<span className="text-xs font-medium text-foreground">
							{a.title}
						</span>
					</div>
				))}
			</div>
		</motion.div>
	);
}
