"use client";

import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand } from "@visx/scale";
import { TrendCard } from "@/lib/components/trends/trend-card";
import type { MoodCalendarMonth } from "@/lib/hooks/queries/use-trends";

interface MoodCalendarProps {
	calendar: MoodCalendarMonth[];
}

function CalendarGrid({
	calendar,
	width,
	height,
}: {
	calendar: MoodCalendarMonth[];
	width: number;
	height: number;
}) {
	const xScale = scaleBand<string>({
		range: [0, width],
		domain: calendar.map((d) => d.monthName),
		padding: 0.2,
	});

	const getMoodColor = (severity: number | null) => {
		if (severity === null) return "#f4f4f5"; // zinc-100
		if (severity >= 8) return "#71717a"; // zinc-500
		if (severity >= 5) return "#a1a1aa"; // zinc-400
		if (severity >= 3) return "#d4d4d8"; // zinc-300
		return "#e4e4e7"; // zinc-200
	};

	return (
		<svg width={width} height={height}>
			<Group>
				{calendar.map((month) => {
					const x = xScale(month.monthName) || 0;
					const avgSeverity =
						month.days.filter((d) => d.moodSeverity !== null).length > 0
							? month.days.reduce((acc, d) => acc + (d.moodSeverity || 0), 0) /
								month.days.filter((d) => d.moodSeverity !== null).length
							: null;

					return (
						<Group key={month.month} left={x}>
							<circle
								cx={xScale.bandwidth() / 2}
								cy={height / 3}
								r={Math.min(xScale.bandwidth() / 2, height / 4)}
								fill={getMoodColor(avgSeverity)}
								stroke="#e4e4e7"
								strokeWidth={1}
							/>
							<text
								x={xScale.bandwidth() / 2}
								y={height - 5}
								textAnchor="middle"
								fontSize={10}
								fill="#71717a"
							>
								{month.monthName.substring(0, 3)}
							</text>
						</Group>
					);
				})}
			</Group>
		</svg>
	);
}

export function MoodCalendar({ calendar }: MoodCalendarProps) {
	const hasData =
		calendar &&
		calendar.some((month) => month.days.some((day) => day.moodLabel !== null));

	return (
		<TrendCard
			title="Mood Calendar"
			subtitle="Collected from app openings and mood check-in's"
		>
			{hasData ? (
				<div className="h-24 relative">
					<ParentSize>
						{({ width, height }) => (
							<CalendarGrid calendar={calendar} width={width} height={height} />
						)}
					</ParentSize>
				</div>
			) : (
				<div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
					No calendar data yet. Complete daily check-ins to fill your mood
					calendar.
				</div>
			)}
		</TrendCard>
	);
}
