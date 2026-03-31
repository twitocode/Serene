"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ActivityImpactChart } from "@/lib/components/trends/activity-impact-chart";
import { MoodBreakdownChart } from "@/lib/components/trends/mood-breakdown-chart";
import { MoodCalendar } from "@/lib/components/trends/mood-calendar";
import { SectionLabel } from "@/lib/components/trends/section-label";
import { SocialTrends } from "@/lib/components/trends/social-trends";
import { SomaticTrends } from "@/lib/components/trends/somatic-trends";
import { TopActivitiesChart } from "@/lib/components/trends/top-activities-chart";
import { TopEmotionsChart } from "@/lib/components/trends/top-emotions-chart";
import { TrendsSkeleton } from "@/lib/components/trends/trends-skeleton";
import { YearSelector } from "@/lib/components/trends/year-selector";
import { useTrends } from "@/lib/hooks/queries/use-trends";

export default function TrendsPage() {
	const currentYear = new Date().getFullYear();
	const [year, setYear] = useState(currentYear);
	const { data: trends, isPending, isError, error } = useTrends(year);

	if (isError) {
		return (
			<div className="flex h-full items-center justify-center p-8">
				<div className="text-center">
					<p className="text-destructive font-semibold">
						Failed to load trends
					</p>
					<p className="text-sm text-muted-foreground">
						{(error as Error)?.message || "An unexpected error occurred."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-full flex-col">
			<div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-36 pt-6 md:px-6 md:pt-8">
				<motion.header
					initial={{ opacity: 0, y: -12 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8 text-center md:mb-10"
				>
					<p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
						Insights
					</p>
					<h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
						Trends
					</h1>
					<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
						Patterns from your check-ins and reflections: no judgment, just
						clarity.
					</p>
				</motion.header>

				{isPending ? (
					<TrendsSkeleton />
				) : (
					<div className="flex flex-col gap-10 md:gap-12">
						{!trends ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground">
									No trend data available for {year}.
								</p>
							</div>
						) : (
							<>
								<section>
									<SectionLabel>General</SectionLabel>
									<div className="flex flex-col gap-4">
										<motion.div
											initial={{ opacity: 0, y: 16 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.05 }}
										>
											<TopActivitiesChart
												activities={trends.topActivities || []}
											/>
										</motion.div>
										<motion.div
											initial={{ opacity: 0, y: 16 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 }}
										>
											<MoodBreakdownChart
												data={
													trends.moodBreakdown || {
														thisYear: [],
														previousYear: [],
													}
												}
											/>
										</motion.div>
										<motion.div
											initial={{ opacity: 0, y: 16 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.15 }}
										>
											<MoodCalendar calendar={trends.moodCalendar || []} />
										</motion.div>
									</div>
								</section>

								<section>
									<SectionLabel>Emotions & Body</SectionLabel>
									<div className="flex flex-col gap-4">
										<motion.div
											initial={{ opacity: 0, y: 16 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.2 }}
										>
											<TopEmotionsChart
												data={
													trends.moodBreakdown || {
														thisYear: [],
														previousYear: [],
													}
												}
											/>
										</motion.div>
										<motion.div
											initial={{ opacity: 0, y: 16 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.25 }}
										>
											<SomaticTrends data={trends.somaticData} />
										</motion.div>
									</div>
								</section>

								<section>
									<SectionLabel>Impact & Community</SectionLabel>
									<div className="flex flex-col gap-4">
										<motion.div
											initial={{ opacity: 0, y: 16 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.35 }}
										>
											<ActivityImpactChart data={trends.activityImpact} />
										</motion.div>
										<motion.div
											initial={{ opacity: 0, y: 16 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.4 }}
										>
											<SocialTrends data={trends.communityStats} />
										</motion.div>
									</div>
								</section>
							</>
						)}
					</div>
				)}
			</div>

			<div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/80 bg-background/90 backdrop-blur-md md:left-[var(--sidebar-width)]">
				<div className="mx-auto max-w-3xl">
					<YearSelector year={year} onYearChange={setYear} />
				</div>
			</div>
		</div>
	);
}
