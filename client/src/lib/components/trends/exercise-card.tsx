"use client";

import { TrendCard } from "@/lib/components/trends/trend-card";
import { Button } from "@/lib/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

interface ExerciseCardProps {
  title: string;
  subtitle: string;
  tabs: string[];
  months: { name: string; completed: boolean }[];
}

export function ExerciseCard({
  title,
  subtitle,
  tabs,
  months,
}: ExerciseCardProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <TrendCard title={title} subtitle={subtitle}>
      <div className="mb-5 flex flex-wrap gap-2 border-b border-border/50 pb-4">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "h-8 rounded-full px-4 text-xs font-medium",
              activeTab === tab ? "shadow-sm" : "border-border/80 bg-transparent",
            )}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
        {months.map((month, index) => (
          <div key={index} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full border-2 transition-colors",
                month.completed
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/80 bg-muted/30",
              )}
            >
              {month.completed ? <Check className="size-4" strokeWidth={2.5} /> : null}
            </div>
            <span className="text-[0.65rem] text-muted-foreground">{month.name}</span>
          </div>
        ))}
      </div>
    </TrendCard>
  );
}
