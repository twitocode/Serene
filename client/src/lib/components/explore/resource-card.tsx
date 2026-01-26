"use client";

import { ExploreContent } from "@/lib/types";
import { ExternalLink, FileText, Video } from "lucide-react";
import { motion } from "motion/react";

interface ResourceCardProps {
  resource: ExploreContent;
  index?: number;
}

export function ResourceCard({ resource, index = 0 }: ResourceCardProps) {
  const isVideo = resource.type === "Video";

  return (
    <motion.a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="group block bg-card rounded-3xl p-6 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isVideo
              ? "bg-coral/20 text-coral"
              : "bg-periwinkle/20 text-periwinkle"
          }`}
        >
          {isVideo ? (
            <Video className="w-3 h-3" />
          ) : (
            <FileText className="w-3 h-3" />
          )}
          <span>{resource.type}</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {resource.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
        {resource.description}
      </p>

      <div className="flex items-center gap-2 text-xs font-medium text-primary">
        <span className="group-hover:underline">View resource</span>
        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </motion.a>
  );
}
