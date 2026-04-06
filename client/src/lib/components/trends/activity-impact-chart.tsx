"use client";

import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { TrendCard } from "@/lib/components/trends/trend-card";
import type { ActivityImpactItem } from "@/lib/hooks/queries/use-trends";

interface ActivityImpactChartProps {
	data?: ActivityImpactItem[];
}

function ImpactChart({
	data,
	width,
	height,
}: {
	data: ActivityImpactItem[];
	width: number;
	height: number;
}) {
	const xScale = scaleLinear<number>({
		range: [0, width - 40],
		domain: [0, Math.max(...data.map((d) => d.moodImprovement), 1)],
	});

	const yScale = scaleBand<string>({
		range: [0, height],
		domain: data.map((d) => d.activity),
		padding: 0.4,
	});

	return (
		<svg width={width} height={height}>
			<Group>
				{data.map((d) => {
					const barWidth = xScale(d.moodImprovement);
					const barHeight = yScale.bandwidth();
					const barX = 0;
					const barY = yScale(d.activity) ?? 0;
					return (
						<Group key={`impact-${d.activity}`}>
							<Bar
								x={barX}
								y={barY}
								width={barWidth}
								height={barHeight}
								fill="#71717a"
								rx={2}
							/>
							<text
								x={barWidth + 5}
								y={barY + barHeight / 2}
								dy=".33em"
								fontSize={10}
								fill="#71717a"
								fontWeight={500}
							>
								+{d.moodImprovement}%
							</text>
						</Group>
					);
				})}
			</Group>
		</svg>
	);
}

export function ActivityImpactChart({ data }: ActivityImpactChartProps) {
	const hasData = data && data.length > 0;
	const displayData = hasData ? data.slice(0, 4) : [];

	return (
		<TrendCard
			title="Mood Boosters"
			subtitle="Activities that resulted in the highest mood increase"
		>
			{hasData ? (
				<div className="space-y-4">
					<div className="h-32 relative">
						<ParentSize>
							{({ width, height }) => (
								<ImpactChart data={displayData} width={width} height={height} />
							)}
						</ParentSize>
					</div>
					<div className="grid grid-cols-2 gap-x-4 gap-y-1">
						{displayData.map((d, i) => (
							<div key={i} className="flex items-center gap-2 overflow-hidden">
								<div className="w-1.5 h-1.5 rounded-full bg-zinc-300 flex-shrink-0" />
								<span className="text-[10px] text-muted-foreground truncate uppercase tracking-tight">
									{d.activity}
								</span>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
					Complete activities to see their impact on your mood.
				</div>
			)}
		</TrendCard>
	);
}
