"use client";

import FemaleBody from "@/lib/components/checkin/bodies/female-body";
import MaleBody from "@/lib/components/checkin/bodies/male-body";
import { TrendCard } from "@/lib/components/trends/trend-card";
import { Badge } from "@/lib/components/ui/badge";
import type { SomaticData } from "@/lib/hooks/queries/use-trends";
import { useUserQuery } from "@/lib/hooks/queries/use-user";

interface SomaticTrendsProps {
	data?: SomaticData;
}

export function SomaticTrends({ data }: SomaticTrendsProps) {
	const { data: user } = useUserQuery();

	// Use data from trends endpoint or fallback to counting checkins directly
	const partCounts = data?.partCounts || {};
	const topSensations = data?.topSensations || [];

	const hasData = Object.keys(partCounts).length > 0;

	const mockSomaticState = hasData
		? Object.keys(partCounts).reduce(
				(acc, part) => {
					acc[part] = { x: 0, y: 0, sensations: [] };
					return acc;
				},
				{} as Record<string, { x: number; y: number; sensations: string[] }>,
			)
		: {};

	return (
		<TrendCard
			title="Physical Sensations"
			subtitle="Where you've felt tension or discomfort most often"
		>
			<div className="flex flex-col md:flex-row gap-6 items-center">
				<div className="w-40 h-64 flex justify-center grayscale opacity-70">
					{user?.gender === "Female" ? (
						<FemaleBody somaticState={mockSomaticState} onClick={() => {}} />
					) : (
						<MaleBody somaticState={mockSomaticState} onClick={() => {}} />
					)}
				</div>
				<div className="flex-1 space-y-4">
					<div>
						<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
							Top Sensations
						</h4>
						<div className="flex flex-wrap gap-2">
							{topSensations.length > 0 ? (
								topSensations.map((s, i) => (
									<Badge
										key={i}
										variant="secondary"
										className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border-none"
									>
										{s.sensation}{" "}
										<span className="ml-1 opacity-50">{s.count}</span>
									</Badge>
								))
							) : (
								<span className="text-sm text-muted-foreground">
									No sensation data yet.
								</span>
							)}
						</div>
					</div>
					<div>
						<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
							Most Affected Areas
						</h4>
						<div className="space-y-2">
							{hasData ? (
								Object.entries(partCounts)
									.sort(([, a], [, b]) => b - a)
									.slice(0, 3)
									.map(([part, count], i) => (
										<div
											key={i}
											className="flex items-center justify-between text-sm"
										>
											<span className="text-foreground">{part}</span>
											<span className="text-zinc-400 font-medium">
												{count} reports
											</span>
										</div>
									))
							) : (
								<span className="text-sm text-muted-foreground">
									Keep checking in to see patterns.
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</TrendCard>
	);
}
