"use client";

import { TrendCard } from "@/lib/components/trends/trend-card";
import { MoodCalendarMonth } from "@/lib/hooks/queries/use-trends";

interface MoodCalendarProps {
  calendar: MoodCalendarMonth[];
}

// Map mood severity to colors
function getMoodColor(severity: number | null): string {
  if (severity === null) return "transparent";
  if (severity >= 8) return "var(--chart-3)"; // Good mood - green/lime
  if (severity >= 5) return "var(--chart-1)"; // Neutral - blue
  if (severity >= 3) return "var(--chart-2)"; // Low mood - coral
  return "var(--destructive)"; // Very low
}

export function MoodCalendar({ calendar }: MoodCalendarProps) {
  const hasData = calendar.some(month => month.days.some(day => day.moodLabel !== null));

  return (
    <TrendCard title="Mood Calendar" subtitle="Collected from app openings and mood check-in's">
      {hasData ? (
        <div className="grid grid-cols-6 gap-4">
          {calendar.map((month) => (
            <div key={month.month} className="text-center">
              <div className="w-8 h-8 mx-auto rounded-full border-2 border-border flex items-center justify-center mb-1">
                {month.days.filter(d => d.moodLabel !== null).length > 0 && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: getMoodColor(
                        month.days
                          .filter(d => d.moodSeverity !== null)
                          .reduce((sum, d) => sum + (d.moodSeverity || 0), 0) /
                          (month.days.filter(d => d.moodSeverity !== null).length || 1)
                      ),
                    }}
                  />
                )}
              </div>
              <span className="text-xs text-muted-foreground">{month.monthName}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
          No calendar data yet. Complete daily check-ins to fill your mood calendar.
        </div>
      )}
    </TrendCard>
  );
}
