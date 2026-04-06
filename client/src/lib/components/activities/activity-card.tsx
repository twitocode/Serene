"use client";

import { Check, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import type { ActivityResponse } from "@/lib/types/api-types";

export function ActivityCard({
	activity,
	onComplete,
	onDelete,
}: {
	activity: ActivityResponse;
	onComplete?: () => void;
	onDelete?: () => void;
}) {
	const categoryColors: Record<
		string,
		{ bg: string; text: string; border: string }
	> = {
		Mindfulness: {
			bg: "bg-periwinkle/15 dark:bg-periwinkle/25",
			text: "text-periwinkle",
			border: "border-periwinkle/20 dark:border-periwinkle/30",
		},
		Movement: {
			bg: "bg-lime/15 dark:bg-lime/25",
			text: "text-lime",
			border: "border-lime/20 dark:border-lime/30",
		},
		Creative: {
			bg: "bg-coral/15 dark:bg-coral/25",
			text: "text-coral",
			border: "border-coral/20 dark:border-coral/30",
		},
		Social: {
			bg: "bg-sage/15 dark:bg-sage/25",
			text: "text-sage",
			border: "border-sage/20 dark:border-sage/30",
		},
		"Self-Care": {
			bg: "bg-[#f0a694]/15 dark:bg-[#f0a694]/25",
			text: "text-[#f0a694]",
			border: "border-[#f0a694]/20 dark:border-[#f0a694]/30",
		},
		Learning: {
			bg: "bg-cyan/15 dark:bg-cyan/25",
			text: "text-cyan",
			border: "border-cyan/20 dark:border-cyan/30",
		},
	};

	const colors = (activity.category && categoryColors[activity.category]) || {
		bg: "bg-muted",
		text: "text-muted-foreground",
		border: "border-border",
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			className={`flex items-center gap-4 rounded-xl border border-border/80 bg-card ${
				activity.completed
					? "opacity-60"
					: "hover:bg-periwinkle/[0.04] dark:hover:bg-periwinkle/[0.08] cursor-pointer hover:border-periwinkle/30"
			} px-4 py-3 transition-all duration-200`}
		>
			<div className="min-w-0 flex-1">
				<p
					className={`text-sm font-medium ${activity.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
				>
					{activity.title}
				</p>
				<div className="mt-1 flex items-center gap-2">
					{activity.category && (
						<Badge
							variant="secondary"
							className={`text-[10px] h-4 px-1.5 font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
						>
							{activity.category}
						</Badge>
					)}
					<span className="text-[10px] text-muted-foreground">
						{activity.scheduledDate}
					</span>
					{activity.completed &&
						activity.moodBefore != null &&
						activity.moodAfter != null && (
							<span className="text-[10px] text-muted-foreground">
								Mood: {activity.moodBefore} → {activity.moodAfter}
							</span>
						)}
				</div>
			</div>
			<div className="flex shrink-0 gap-1">
				{!activity.completed && onComplete && (
					<Button
						size="icon"
						variant="ghost"
						className="size-8 hover:bg-primary/10 hover:text-primary"
						onClick={onComplete}
					>
						<Check className="size-4" />
					</Button>
				)}
				{!activity.completed && onDelete && (
					<Button
						size="icon"
						variant="ghost"
						className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
						onClick={onDelete}
					>
						<Trash2 className="size-4" />
					</Button>
				)}
			</div>
		</motion.div>
	);
}
