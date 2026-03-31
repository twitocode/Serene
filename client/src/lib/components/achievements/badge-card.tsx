"use client";

import { Lock, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/lib/components/ui/card";
import type { AchievementWithStatus } from "@/lib/types/api-types";

export function BadgeCard({
	achievement,
	index,
}: {
	achievement: AchievementWithStatus;
	index: number;
}) {
	const isUnlocked = achievement.unlocked;

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.04 }}
		>
			<Card
				className={`relative overflow-hidden border-border/80 transition-colors ${
					isUnlocked ? "bg-primary/5 shadow-sm" : "bg-muted/20 opacity-60"
				}`}
			>
				<CardContent className="flex flex-col items-center gap-2 p-4 text-center">
					<div
						className={`flex size-10 items-center justify-center rounded-full ${
							isUnlocked
								? "bg-primary/15 text-primary"
								: "bg-muted text-muted-foreground"
						}`}
					>
						{isUnlocked ? (
							<Trophy className="size-5" />
						) : (
							<Lock className="size-4" />
						)}
					</div>
					<p
						className={`text-sm font-semibold leading-tight ${
							isUnlocked ? "text-foreground" : "text-muted-foreground"
						}`}
					>
						{achievement.title}
					</p>
					<p className="text-xs leading-snug text-muted-foreground">
						{achievement.description}
					</p>
					<span
						className={`text-xs font-medium ${
							isUnlocked ? "text-primary" : "text-muted-foreground/60"
						}`}
					>
						{achievement.points} pts
					</span>
				</CardContent>
			</Card>
		</motion.div>
	);
}
