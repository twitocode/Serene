"use client";

import CheckinFlow from "@/lib/components/checkin/checkin-flow";
import { MochiDefault } from "@/lib/components/common/mochi";
import DateScroll from "@/lib/components/home/date-scroll";
import { useCheckinStore } from "@/lib/components/providers/zustand-provider";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import { getMoodFromLabel, getSeverityColor, MoodLabel } from "@/lib/data/moods";
import { useCheckinsQuery } from "@/lib/hooks/queries/use-checkins";
import { cn } from "@/lib/utils";
import { isToday } from "date-fns";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function CheckinPage() {
  const { displayDate, startCheckin, isCheckingIn, changeDate, cancel } =
    useCheckinStore((s) => s);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  const { data: checkins } = useCheckinsQuery(displayDate);

  const onStartCheckin = () => {
    startCheckin();
  };

  return isCheckingIn ? (
    <CheckinFlow />
  ) : (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-8 px-4 py-6 md:py-8">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Daily rhythm
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Check-in
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Pick a day, reflect, and leave when you&apos;re ready.
        </p>
      </motion.header>

      <DateScroll selectedDate={displayDate} changeSelectedDate={changeDate} />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="card-organic relative overflow-hidden border-border/80 bg-card p-6 shadow-md md:p-8"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <MochiDefault className="size-36 md:size-40" />
          </div>
          <div className="flex max-w-md flex-col items-center gap-4 text-center md:items-start md:text-left">
            <h2 className="font-serif text-2xl font-semibold leading-snug text-foreground md:text-3xl">
              {!isToday(displayDate)
                ? "Add another check-in for this day?"
                : checkins?.length === 0
                  ? "Ready to check in?"
                  : "Want to check in again?"}
            </h2>
            <Button
              size="lg"
              className="btn-playful w-full sm:w-auto"
              onClick={onStartCheckin}
            >
              {checkins?.length === 0 ? "Start check-in" : "Check in again"}
            </Button>
          </div>
        </div>
      </motion.section>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Logged this day
        </h3>
        {checkins && checkins.length > 0 ? (
          checkins
            .sort(
              (a, b) =>
                Number(new Date(b.dateCompleted)) -
                Number(new Date(a.dateCompleted)),
            )
            .map((checkin) => {
              const formattedDate = new Intl.DateTimeFormat(
                navigator.language,
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                },
              ).format(new Date(checkin.dateCompleted));

              const checkinMood = getMoodFromLabel(
                checkin.moodLabel as MoodLabel,
              );
              const severityClass = checkinMood
                ? getSeverityColor(checkinMood.severity)
                : "";

              return (
                <motion.div
                  key={checkin.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="card-organic flex flex-col justify-between gap-3 border-border/80 p-4 sm:flex-row sm:items-center"
                >
                  <p
                    className="text-sm text-muted-foreground"
                    suppressHydrationWarning
                  >
                    {formattedDate}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "w-fit text-sm font-medium tabular-nums",
                      severityClass,
                    )}
                  >
                    {checkin.moodLabel}
                  </Badge>
                </motion.div>
              );
            })
        ) : (
          <p className="rounded-2xl border border-dashed border-border/80 bg-muted/15 py-8 text-center text-sm text-muted-foreground">
            No check-ins for this date yet.
          </p>
        )}
      </div>
    </div>
  );
}
