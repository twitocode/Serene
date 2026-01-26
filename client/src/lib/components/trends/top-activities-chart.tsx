"use client";

import { TrendCard } from "@/lib/components/trends/trend-card";
import { TopActivityItem } from "@/lib/hooks/queries/use-trends";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface TopActivitiesChartProps {
  activities: TopActivityItem[];
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function TopActivitiesChart({ activities }: TopActivitiesChartProps) {
  const hasData = activities.length > 0;

  // Transform data for the ring chart
  const chartData = hasData
    ? activities.map((item) => ({
        name: item.activity,
        value: item.count,
        percentage: item.percentage,
      }))
    : [{ name: "No data", value: 1 }];

  return (
    <TrendCard title="Your top activities this year" subtitle="Your daily focus from Morning Preparation">
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
        <div className="flex-1 space-y-2">
          {hasData ? (
            activities.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-foreground truncate max-w-[120px]">
                    {activity.activity.length > 20
                      ? activity.activity.substring(0, 20) + "..."
                      : activity.activity}
                  </span>
                </div>
                <span className="text-primary font-medium">{activity.percentage}%</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No data yet. Complete check-ins to see your top activities.
            </div>
          )}
        </div>
      </div>
    </TrendCard>
  );
}
