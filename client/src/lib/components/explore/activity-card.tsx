"use client";

import { icons, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import type { Activity } from "@/lib/types";
import { getCurrentDate } from "@/lib/helpers/get-current-date";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActivityCardProps {
	activity: Activity;
	index?: number;
}

// Helper to get icon component from string name
function getIconComponent(iconName: string): LucideIcon {
	const pascalCase = iconName
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("") as keyof typeof icons;

	return icons[pascalCase] || icons.Circle;
}

export function ActivityCard({ activity, index = 0 }: ActivityCardProps) {
	const router = useRouter();
  const isMobile = useIsMobile();

	const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
		Mindfulness: { 
			bg: "bg-periwinkle/15 dark:bg-periwinkle/25", 
			text: "text-periwinkle",
			border: "border-periwinkle/20 dark:border-periwinkle/30"
		},
		Movement: { 
			bg: "bg-lime/15 dark:bg-lime/25", 
			text: "text-lime",
			border: "border-lime/20 dark:border-lime/30"
		},
		Creative: { 
			bg: "bg-coral/15 dark:bg-coral/25", 
			text: "text-coral",
			border: "border-coral/20 dark:border-coral/30"
		},
		Social: { 
			bg: "bg-sage/15 dark:bg-sage/25", 
			text: "text-sage",
			border: "border-sage/20 dark:border-sage/30"
		},
		"Self-Care": { 
			bg: "bg-[#f0a694]/15 dark:bg-[#f0a694]/25", 
			text: "text-[#f0a694]",
			border: "border-[#f0a694]/20 dark:border-[#f0a694]/30"
		},
		Learning: { 
			bg: "bg-cyan/15 dark:bg-cyan/20", 
			text: "text-cyan",
			border: "border-cyan/20 dark:border-cyan/30"
		},
	};

	const colors = categoryColors[activity.category] || {
		bg: "bg-muted",
		text: "text-muted-foreground",
		border: "border-border"
	};

	const IconComponent = getIconComponent(activity.icon);

	const handleClick = () => {
		const params = new URLSearchParams({
			title: activity.title,
			category: activity.category,
			date: getCurrentDate(),
		});
		router.push(`/home/activities?${params.toString()}`);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1, duration: 0.3 }}
			className="group relative bg-card rounded-3xl p-6 border border-border hover:bg-periwinkle/[0.04] dark:hover:bg-periwinkle/[0.08] hover:border-periwinkle/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
			onClick={handleClick}
		>
			<div className="absolute -top-3 -right-3 w-12 h-12 bg-background border-2 border-border rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-hover:border-periwinkle/50 transition-all">
				<IconComponent className="w-5 h-5 text-primary" />
			</div>

			<div className="flex items-center gap-2 mb-3">
				<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
					{activity.category}
				</span>
				<span className="text-xs text-muted-foreground">
					• {activity.duration}
				</span>
			</div>

			<h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
				{activity.title}
			</h3>
			<p className="text-sm text-muted-foreground leading-relaxed">
				{activity.description}
			</p>

			<div className="mt-4 flex items-center text-xs font-medium text-primary lg:opacity-0 group-hover:opacity-100 transition-opacity">
				<span>{isMobile ? "Press to try this activity" :"Try this activity"}</span>
				<svg
					className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</div>
		</motion.div>
	);
}
