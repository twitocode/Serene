"use client";

import { TrendCard } from "@/lib/components/trends/trend-card";
import { MoodBreakdownData } from "@/lib/hooks/queries/use-trends";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface TopEmotionsChartProps {
  data: MoodBreakdownData;
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function TopEmotionsChart({ data }: TopEmotionsChartProps) {
  const hasData = data.thisYear.length > 0;

  const chartData = hasData
    ? data.thisYear.slice(0, 5).map((item) => ({
        name: item.moodLabel,
        value: item.count,
      }))
    : [{ name: "No data", value: 1 }];

  return (
    <TrendCard title="Your top emotions this year" subtitle="Based on your evening reflections and mood check-ins">
      <div className="flex items-center gap-6">
        <div className="w-28 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                paddingAngle={hasData ? 2 : 0}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={hasData ? COLORS[index % COLORS.length] : "var(--muted)"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1">
          {hasData ? (
            <div className="space-y-1">
              {data.thisYear.slice(0, 3).map((emotion, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-foreground capitalize">{emotion.moodLabel}</span>
                  <span className="text-muted-foreground">({emotion.count})</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-muted" />
                <span>No data yet</span>
              </div>
              <p className="text-xs">
                Complete your evening reflections and mood check-ins to understand your emotions
              </p>
            </div>
          )}
        </div>
      </div>
    </TrendCard>
  );
}
