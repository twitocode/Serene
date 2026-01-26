"use client";

import { TrendCard } from "@/lib/components/trends/trend-card";
import { Button } from "@/lib/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

interface ExerciseCardProps {
  title: string;
  subtitle: string;
  tabs: string[];
  months: { name: string; completed: boolean }[];
}

export function ExerciseCard({ title, subtitle, tabs, months }: ExerciseCardProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <TrendCard title={title} subtitle={subtitle}>
      <div className="flex gap-4 border-b border-border/50 mb-6 focus-visible:outline-none">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="text-xs h-7 px-3"
          >
            {tab.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
        {months.map((month, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                month.completed
                  ? "border-primary bg-primary/10"
                  : "border-border"
              }`}
            >
              {month.completed && <Check className="w-4 h-4 text-primary" />}
            </div>
            <span className="text-xs text-muted-foreground">{month.name}</span>
          </div>
        ))}
      </div>
    </TrendCard>
  );
}
