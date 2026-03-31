"use client";

import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { TrendCard } from "@/lib/components/trends/trend-card";

interface TopEmotionsChartProps {
	data: {
		thisYear: { moodLabel: string; count: number }[];
	};
}

interface EmotionDataItem {
	moodLabel: string;
	count: number;
}

function EmotionsChart({
	data,
	width,
	height,
}: {
	data: EmotionDataItem[];
	width: number;
	height: number;
}) {
	const xScale = scaleBand<string>({
		range: [0, width],
		domain: data.map((d) => d.moodLabel),
		padding: 0.3,
	});

	const yScale = scaleLinear<number>({
		range: [height, 0],
		domain: [0, Math.max(...data.map((d) => d.count), 1)],
	});

	return (
		<svg width={width} height={height}>
			<Group>
				{data.map((d) => {
					const barWidth = xScale.bandwidth();
					const barHeight = height - (yScale(d.count) || 0);
					const barX = xScale(d.moodLabel);
					const barY = height - barHeight;
					return (
						<Bar
							key={`emotion-bar-${d.moodLabel}`}
							x={barX}
							y={barY}
							width={barWidth}
							height={barHeight}
							fill="#71717a"
							rx={4}
						/>
					);
				})}
			</Group>
		</svg>
	);
}

export function TopEmotionsChart({ data }: TopEmotionsChartProps) {
	const hasData = data && data.thisYear && data.thisYear.length > 0;
	const sortedEmotions = hasData
		? [...data.thisYear].sort((a, b) => b.count - a.count).slice(0, 5)
		: [];

	return (
		<TrendCard
			title="Top Emotions"
			subtitle="The feelings you've experienced most frequently"
		>
			{hasData ? (
				<div className="h-40 relative">
					<ParentSize>
						{({ width, height }) => (
							<EmotionsChart
								data={sortedEmotions}
								width={width}
								height={height}
							/>
						)}
					</ParentSize>
					<div className="flex justify-between mt-2 px-2">
						{sortedEmotions.map((e) => (
							<span
								key={e.moodLabel}
								className="text-[10px] text-muted-foreground uppercase tracking-wider"
							>
								{e.moodLabel}
							</span>
						))}
					</div>
				</div>
			) : (
				<div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
					No emotion data yet.
				</div>
			)}
		</TrendCard>
	);
}
