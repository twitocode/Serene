"use client";

import { TrendCard } from "@/lib/components/trends/trend-card";

interface InfluenceCardProps {
  title: string;
  type: "positive" | "negative";
  items: string[];
}

export function InfluenceCard({ title, type, items }: InfluenceCardProps) {
  const hasData = items.length > 0;

  return (
    <TrendCard title={title}>
      {hasData ? (
        <div className="space-y-2">
          {items.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className={`text-sm p-2 rounded-lg ${
                type === "positive"
                  ? "bg-lime/10 text-lime"
                  : "bg-coral/10 text-coral"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4">
          <p className="text-sm font-medium text-muted-foreground">No data yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Complete your evening reflection or mood check-in
          </p>
        </div>
      )}
    </TrendCard>
  );
}
