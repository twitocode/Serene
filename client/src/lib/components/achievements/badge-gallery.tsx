"use client";

import { Card, CardContent } from "@/lib/components/ui/card";
import { useAchievementsQuery } from "@/lib/hooks/queries/use-achievements";
import { AchievementWithStatus } from "@/lib/types/api-types";
import { Lock, Trophy } from "lucide-react";
import { motion } from "motion/react";

export default function BadgeGallery() {
  const { data: achievements = [], isPending } = useAchievementsQuery();

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);
  const totalPoints = unlocked.reduce((sum, a) => sum + a.points, 0);

  if (isPending) return null;

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col px-4 pb-12 pt-6 md:px-6">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Progress
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Achievements
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {unlocked.length} of {achievements.length} unlocked
          {totalPoints > 0 && ` - ${totalPoints} points earned`}
        </p>
      </motion.header>

      {unlocked.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Unlocked
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {unlocked.map((a, i) => (
              <BadgeCard key={a.id} achievement={a} index={i} />
            ))}
          </div>
        </section>
      )}

      {locked.length > 0 && (
        <section>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Locked
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {locked.map((a, i) => (
              <BadgeCard key={a.id} achievement={a} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function BadgeCard({
  achievement,
  index,
}: {
  achievement: AchievementWithStatus;
  index: number;
}) {
  const isUnlocked = achievement.unlocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card
        className={`relative overflow-hidden border-border/80 transition-colors ${
          isUnlocked
            ? "bg-primary/5 shadow-sm"
            : "bg-muted/20 opacity-60"
        }`}
      >
        <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
          <div
            className={`flex size-10 items-center justify-center rounded-full ${
              isUnlocked
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isUnlocked ? (
              <Trophy className="size-5" />
            ) : (
              <Lock className="size-4" />
            )}
          </div>
          <p
            className={`text-sm font-semibold leading-tight ${
              isUnlocked ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {achievement.title}
          </p>
          <p className="text-xs leading-snug text-muted-foreground">
            {achievement.description}
          </p>
          <span
            className={`text-xs font-medium ${
              isUnlocked ? "text-primary" : "text-muted-foreground/60"
            }`}
          >
            {achievement.points} pts
          </span>
        </CardContent>
      </Card>
    </motion.div>
  );
}
