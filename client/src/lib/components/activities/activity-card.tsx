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
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex items-center gap-4 rounded-xl border border-border/80 bg-card px-4 py-3"
		>
			<div className="min-w-0 flex-1">
				<p
					className={`text-sm font-medium ${activity.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
				>
					{activity.title}
				</p>
				<div className="mt-1 flex items-center gap-2">
					{activity.category && (
						<Badge variant="secondary" className="text-xs">
							{activity.category}
						</Badge>
					)}
					<span className="text-xs text-muted-foreground">
						{activity.scheduledDate}
					</span>
					{activity.completed &&
						activity.moodBefore != null &&
						activity.moodAfter != null && (
							<span className="text-xs text-muted-foreground">
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
						className="size-8"
						onClick={onComplete}
					>
						<Check className="size-4" />
					</Button>
				)}
				{!activity.completed && onDelete && (
					<Button
						size="icon"
						variant="ghost"
						className="size-8 text-muted-foreground hover:text-destructive"
						onClick={onDelete}
					>
						<Trash2 className="size-4" />
					</Button>
				)}
			</div>
		</motion.div>
	);
}
