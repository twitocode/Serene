"use client";

import { Activity } from "@/lib/types";
import { icons, LucideIcon } from "lucide-react";
import { motion } from "motion/react";

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
  const categoryColors: Record<string, { bg: string; text: string }> = {
    Mindfulness: { bg: "bg-periwinkle/20", text: "text-periwinkle" },
    Movement: { bg: "bg-lime/20", text: "text-lime" },
    Creative: { bg: "bg-coral/20", text: "text-coral" },
    Social: { bg: "bg-sage/20", text: "text-sage" },
    "Self-Care": { bg: "bg-[#f0a694]/20", text: "text-[#f0a694]" },
    Learning: { bg: "bg-navy/20", text: "text-navy" },
  };

  const colors = categoryColors[activity.category] || {
    bg: "bg-muted",
    text: "text-muted-foreground",
  };

  const IconComponent = getIconComponent(activity.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="group relative bg-card rounded-3xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-background border-2 border-border rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
        <IconComponent className="w-5 h-5 text-primary" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          {activity.category}
        </span>
        <span className="text-xs text-muted-foreground">• {activity.duration}</span>
      </div>

      <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
        {activity.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {activity.description}
      </p>

      <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Try this activity</span>
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
