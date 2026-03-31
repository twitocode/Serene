"use client";

import { Group } from "@visx/group";
import { BarGroup } from "@visx/shape";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { ParentSize } from "@visx/responsive";
import { TrendCard } from "@/lib/components/trends/trend-card";
import { MoodBreakdownData } from "@/lib/hooks/queries/use-trends";
import { Angry, Frown, Heart, Meh, Smile } from "lucide-react";

interface MoodBreakdownChartProps {
  data: MoodBreakdownData;
}

const moodIcons: Record<string, React.ElementType> = {
  happy: Smile,
  neutral: Meh,
  sad: Frown,
  anxious: Heart,
  angry: Angry,
};

interface ChartDataItem {
  mood: string;
  thisYear: number;
  previousYear: number;
}

function BarChart({ data, width, height }: { data: ChartDataItem[], width: number, height: number }) {
  const keys = ["thisYear", "previousYear"];
  
  const x0Scale = scaleBand<string>({
    range: [0, width],
    domain: data.map((d) => d.mood),
    padding: 0.2,
  });
  
  const x1Scale = scaleBand<string>({
    range: [0, x0Scale.bandwidth()],
    domain: keys,
    padding: 0.1,
  });
  
  const yScale = scaleLinear<number>({
    range: [height, 0],
    domain: [0, Math.max(...data.map((d) => Math.max(d.thisYear, d.previousYear)), 1)],
  });
  
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: ["#71717a", "#d4d4d8"],
  });

  return (
    <svg width={width} height={height}>
      <Group>
        <BarGroup
          data={data}
          keys={keys}
          height={height}
          x0={(d) => d.mood}
          x0Scale={x0Scale}
          x1Scale={x1Scale}
          yScale={yScale}
          color={colorScale}
        >
          {(barGroups) =>
            barGroups.map((barGroup) => (
              <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                {barGroup.bars.map((bar) => (
                  <rect
                    key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    rx={2}
                  />
                ))}
              </Group>
            ))
          }
        </BarGroup>
      </Group>
    </svg>
  );
}

export function MoodBreakdownChart({ data }: MoodBreakdownChartProps) {
  const hasData = data && data.thisYear && data.thisYear.length > 0;

  const allMoodLabels = Array.from(new Set([
    ...(data?.thisYear || []).map(m => m.moodLabel.toLowerCase()),
    ...(data?.previousYear || []).map(m => m.moodLabel.toLowerCase())
  ]));

  const chartData = allMoodLabels.map(label => ({
    mood: label,
    thisYear: data?.thisYear.find(m => m.moodLabel.toLowerCase() === label)?.count || 0,
    previousYear: data?.previousYear.find(m => m.moodLabel.toLowerCase() === label)?.count || 0,
  }));

  return (
    <TrendCard title="Mood breakdown" subtitle="Collected from app openings and mood check-in's">
      {hasData ? (
        <div className="space-y-4">
          <div className="h-40 relative">
            <ParentSize>
              {({ width, height }) => (
                <BarChart data={chartData} width={width} height={height} />
              )}
            </ParentSize>
          </div>
          <div className="flex justify-around">
            {chartData.map((item, index) => {
              const Icon = moodIcons[item.mood] || Meh;
              return (
                <div key={index} className="flex flex-col items-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-zinc-500" />
              <span>This year</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-zinc-300" />
              <span>Previous year</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
          No mood data yet. Complete check-ins to see your mood breakdown.
        </div>
      )}
    </TrendCard>
  );
}
