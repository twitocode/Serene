"use client";

import { EnergyLevelChart } from "@/lib/components/trends/energy-level-chart";
import { ExerciseCard } from "@/lib/components/trends/exercise-card";
import { InfluenceCard } from "@/lib/components/trends/influence-card";
import { MoodBreakdownChart } from "@/lib/components/trends/mood-breakdown-chart";
import { MoodCalendar } from "@/lib/components/trends/mood-calendar";
import { TopActivitiesChart } from "@/lib/components/trends/top-activities-chart";
import { TopEmotionsChart } from "@/lib/components/trends/top-emotions-chart";
import { YearSelector } from "@/lib/components/trends/year-selector";
import { SectionLabel } from "@/lib/components/trends/section-label";
import { TrendsSkeleton } from "@/lib/components/trends/trends-skeleton";
import { useTrends } from "@/lib/hooks/queries/use-trends";
import { motion } from "motion/react";
import { useState } from "react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function TrendsPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { data: trends, isPending } = useTrends(year);

  const mockExerciseMonths = MONTHS.map((name, index) => ({
    name,
    completed: index === 0,
  }));

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
            <section>
              <SectionLabel>General</SectionLabel>
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <TopActivitiesChart activities={trends?.topActivities || []} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <MoodBreakdownChart
                    data={trends?.moodBreakdown || { thisYear: [], previousYear: [] }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <MoodCalendar calendar={trends?.moodCalendar || []} />
                </motion.div>
              </div>
            </section>

            <section>
              <SectionLabel>Emotions</SectionLabel>
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TopEmotionsChart
                    data={trends?.moodBreakdown || { thisYear: [], previousYear: [] }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <InfluenceCard title="What lifts you" type="positive" items={[]} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <InfluenceCard title="What weighs on you" type="negative" items={[]} />
                </motion.div>
              </div>
            </section>

            <section>
              <SectionLabel>Habits</SectionLabel>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <EnergyLevelChart energyLevels={trends?.energyLevels || []} />
              </motion.div>
            </section>

            <section className="pb-2">
              <SectionLabel>Exercises</SectionLabel>
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ExerciseCard
                    title="Writing"
                    subtitle="Months when you wrote"
                    tabs={["Months", "Words", "Cloud"]}
                    months={mockExerciseMonths}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <ExerciseCard
                    title="Breathing"
                    subtitle="Days when you did breathing exercises"
                    tabs={["Months", "Sessions", "Duration"]}
                    months={mockExerciseMonths}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ExerciseCard
                    title="Meditation"
                    subtitle="Months when you meditated"
                    tabs={["Months", "Sessions", "Duration"]}
                    months={mockExerciseMonths}
                  />
                </motion.div>
              </div>
            </section>
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
