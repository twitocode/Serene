"use client";

import { EnergyLevelChart } from "@/lib/components/trends/energy-level-chart";
import { ExerciseCard } from "@/lib/components/trends/exercise-card";
import { InfluenceCard } from "@/lib/components/trends/influence-card";
import { MoodBreakdownChart } from "@/lib/components/trends/mood-breakdown-chart";
import { MoodCalendar } from "@/lib/components/trends/mood-calendar";
import { TopActivitiesChart } from "@/lib/components/trends/top-activities-chart";
import { TopEmotionsChart } from "@/lib/components/trends/top-emotions-chart";
import { YearSelector } from "@/lib/components/trends/year-selector";
import { Skeleton } from "@/lib/components/ui/skeleton";
import { useTrends } from "@/lib/hooks/queries/use-trends";
import { motion } from "motion/react";
import { useState } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function TrendsSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-56 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  );
}

export default function TrendsPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { data: trends, isPending } = useTrends(year);

  // Mock exercise data - in a real app this would come from the backend
  const mockExerciseMonths = MONTHS.map((name, index) => ({
    name,
    completed: index === 0, // Only January is completed in the mock
  }));

  return (
    <div className="min-h-full flex flex-col  max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-8 pb-4"
      >
        <h1 className="text-4xl font-semibold text-center font-serif mb-2">Trends</h1>
        <p className="text-center text-muted-foreground">
          Your wellness insights over time
        </p>
      </motion.div>

      <div className="flex-1 overflow-y-auto pb-20">
        {isPending ? (
          <TrendsSkeleton />
        ) : (
          <div className="space-y-8 px-4">
            <section>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xs font-medium text-muted-foreground tracking-widest text-center mb-4">
                  GENERAL INSIGHTS
                </h2>
              </motion.div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <TopActivitiesChart activities={trends?.topActivities || []} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MoodBreakdownChart
                    data={trends?.moodBreakdown || { thisYear: [], previousYear: [] }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <MoodCalendar calendar={trends?.moodCalendar || []} />
                </motion.div>
              </div>
            </section>

            <section>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xs font-medium text-muted-foreground tracking-widest text-center mb-4">
                  EMOTIONS
                </h2>
              </motion.div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <TopEmotionsChart
                    data={trends?.moodBreakdown || { thisYear: [], previousYear: [] }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <InfluenceCard title="What makes you shine" type="positive" items={[]} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <InfluenceCard title="What makes you down" type="negative" items={[]} />
                </motion.div>
              </div>
            </section>

            <section>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xs font-medium text-muted-foreground tracking-widest text-center mb-4">
                  HABITS
                </h2>
              </motion.div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <EnergyLevelChart energyLevels={trends?.energyLevels || []} />
                </motion.div>
              </div>
            </section>

            <section className="pb-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-xs font-medium text-muted-foreground tracking-widest text-center mb-4">
                  EXERCISES
                </h2>
              </motion.div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <ExerciseCard
                    title="Writing"
                    subtitle="Months when you wrote"
                    tabs={["Months", "Words", "Cloud"]}
                    months={mockExerciseMonths}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <ExerciseCard
                    title="Breathing"
                    subtitle="Days when you did breathing exercises"
                    tabs={["Months", "Sessions", "Duration"]}
                    months={mockExerciseMonths}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                >
                  <ExerciseCard
                    title="Meditation"
                    subtitle="Months when you did meditation"
                    tabs={["Months", "Sessions", "Duration"]}
                    months={mockExerciseMonths}
                  />
                </motion.div>
              </div>
            </section>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:left-[var(--sidebar-width)] bg-background border-t border-border">
        <YearSelector year={year} onYearChange={setYear} />
      </div>
    </div>
  );
}
