"use client";

import { motion } from "motion/react";
import { BadgeCard } from "@/lib/components/achievements/badge-card";
import { Card, CardContent } from "@/lib/components/ui/card";
import { useAchievementsQuery } from "@/lib/hooks/queries/use-achievements";

export default function BadgeGallery() {
	const { data: achievements = [], isPending } = useAchievementsQuery();

	const unlocked = achievements.filter((a) => a.unlocked);
	const locked = achievements.filter((a) => !a.unlocked);
	const totalPoints = unlocked.reduce((sum, a) => sum + a.points, 0);

	if (isPending) return null;

	return (
		<div className="mx-auto flex min-h-full max-w-2xl flex-col px-4 pb-12 pt-6 md:px-6">
			<motion.header
				initial={{ opacity: 0, y: -12 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8 text-center"
			>
				<p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
					Progress
				</p>
				<h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
					Achievements
				</h1>
				<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
					{unlocked.length} of {achievements.length} unlocked
					{totalPoints > 0 && ` - ${totalPoints} points earned`}
				</p>
			</motion.header>

			{unlocked.length > 0 && (
				<section className="mb-8">
					<h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
						Unlocked
					</h3>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{unlocked.map((a, i) => (
							<BadgeCard key={a.id} achievement={a} index={i} />
						))}
					</div>
				</section>
			)}

			{locked.length > 0 && (
				<section>
					<h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
						Locked
					</h3>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{locked.map((a, i) => (
							<BadgeCard key={a.id} achievement={a} index={i} />
						))}
					</div>
				</section>
			)}
		</div>
	);
}
