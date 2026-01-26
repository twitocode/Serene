"use client";

import { TrendCard } from "@/lib/components/trends/trend-card";
import { EnergyLevelPoint } from "@/lib/hooks/queries/use-trends";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface EnergyLevelChartProps {
  energyLevels: EnergyLevelPoint[];
}

export function EnergyLevelChart({ energyLevels }: EnergyLevelChartProps) {
  const hasData = energyLevels.some(e => e.averageLevel > 0);

  const chartData = energyLevels.map(e => ({
    month: e.monthName.charAt(0),
    value: e.averageLevel,
  }));

  return (
    <TrendCard title="Your energy level this year" subtitle="Your input from morning and evening reflections">
      {hasData ? (
        <div className="h-40 relative">
          <div className="absolute right-0 top-0 bottom-8 flex flex-col justify-between text-xs text-muted-foreground">
            <span>Very</span>
            <span>Average</span>
            <span>Not at all</span>
          </div>
          <div className="pr-16 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis domain={[0, 10]} hide />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#energyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
          No energy data yet. Complete morning and evening check-ins to track your energy.
        </div>
      )}
    </TrendCard>
  );
}
