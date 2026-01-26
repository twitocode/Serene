"use client";

import { TrendCard } from "@/lib/components/trends/trend-card";
import { MoodBreakdownData } from "@/lib/hooks/queries/use-trends";
import { Angry, Frown, Heart, Meh, Smile } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from "recharts";

interface MoodBreakdownChartProps {
  data: MoodBreakdownData;
}

// Map mood labels to icons and colors
const moodConfig: Record<string, { icon: typeof Smile; color: string }> = {
  happy: { icon: Smile, color: "var(--chart-3)" },
  neutral: { icon: Meh, color: "var(--chart-4)" },
  sad: { icon: Frown, color: "var(--chart-1)" },
  anxious: { icon: Heart, color: "var(--chart-2)" },
  angry: { icon: Angry, color: "var(--destructive)" },
};

export function MoodBreakdownChart({ data }: MoodBreakdownChartProps) {
  const hasData = data.thisYear.length > 0;

  // Get unique moods and combine data
  const allMoods = [...new Set([...data.thisYear.map(m => m.moodLabel.toLowerCase()), ...data.previousYear.map(m => m.moodLabel.toLowerCase())])];
  
  const chartData = allMoods.slice(0, 6).map(mood => {
    const thisYear = data.thisYear.find(m => m.moodLabel.toLowerCase() === mood);
    const prevYear = data.previousYear.find(m => m.moodLabel.toLowerCase() === mood);
    return {
      mood,
      thisYear: thisYear?.count || 0,
      previousYear: prevYear?.count || 0,
      config: moodConfig[mood] || { icon: Meh, color: "var(--muted)" },
    };
  });

  return (
    <TrendCard title="Mood breakdown" subtitle="Collected from app openings and mood check-in's">
      {hasData ? (
        <>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <XAxis
                  dataKey="mood"
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                />
                <Bar dataKey="thisYear" radius={[4, 4, 0, 0]} maxBarSize={16}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.config.color} />
                  ))}
                </Bar>
                <Bar dataKey="previousYear" radius={[4, 4, 0, 0]} maxBarSize={16} opacity={0.3}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.config.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around mt-2">
            {chartData.map((item, index) => {
              const IconComponent = item.config.icon;
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>This year</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              <span>Previous year</span>
            </div>
          </div>
        </>
      ) : (
        <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
          No mood data yet. Complete check-ins to see your mood breakdown.
        </div>
      )}
    </TrendCard>
  );
}
