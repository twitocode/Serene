"use client";

import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { scaleOrdinal } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { TrendCard } from "@/lib/components/trends/trend-card";
import { TopActivityItem } from "@/lib/hooks/queries/use-trends";

interface TopActivitiesChartProps {
  activities: TopActivityItem[];
}

const COLORS = ["#71717a", "#a1a1aa", "#d4d4d8", "#e4e4e7", "#f4f4f5"];

const getColor = scaleOrdinal({
  domain: [0, 1, 2, 3, 4],
  range: COLORS,
});

function PieChart({ activities, width, height }: { activities: TopActivityItem[], width: number, height: number }) {
  const innerRadius = Math.min(width, height) / 3;
  const outerRadius = Math.min(width, height) / 2;
  const centerY = height / 2;
  const centerX = width / 2;

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        <Pie
          data={activities}
          pieValue={(d) => d.count}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          cornerRadius={3}
          padAngle={0.02}
        >
          {(pie) => {
            return pie.arcs.map((arc, index) => {
              const arcPath = pie.path(arc) || "";
              return (
                <g key={`arc-${index}`}>
                  <path d={arcPath} fill={getColor(index)} />
                </g>
              );
            });
          }}
        </Pie>
      </Group>
    </svg>
  );
}

export function TopActivitiesChart({ activities }: TopActivitiesChartProps) {
  const hasData = activities && activities.length > 0;
  const displayActivities = hasData ? activities : [];

  return (
    <TrendCard title="Your top activities this year" subtitle="Your daily focus from Morning Preparation">
      <div className="flex items-center gap-6">
        <div className="w-28 h-28 relative">
          {hasData ? (
            <ParentSize>
              {({ width, height }) => (
                <PieChart activities={displayActivities} width={width} height={height} />
              )}
            </ParentSize>
          ) : (
            <div className="w-full h-full rounded-full border-4 border-muted flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground text-center px-2">No data</span>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {hasData ? (
            displayActivities.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getColor(index) }}
                  />
                  <span className="text-foreground truncate max-w-[120px]">
                    {activity.activity}
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
