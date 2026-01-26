"use client";

import { ActivityCard } from "@/lib/components/explore/activity-card";
import { ExploreSkeleton } from "@/lib/components/explore/explore-skeleton";
import { ResourceCard } from "@/lib/components/explore/resource-card";
import { getRandomActivities } from "@/lib/data/activities-data";
import { useExploreRecommendations } from "@/lib/hooks/queries/use-explore";
import { Sprout } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";

export default function ExplorePage() {
  const { data: recommendations, isPending } = useExploreRecommendations();

  const randomActivities = useMemo(() => getRandomActivities(4), []);

  if (isPending) {
    return <ExploreSkeleton />;
  }

  return (
    <div className="min-h-full max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-semibold text-center font-serif mb-2">
          Explore
        </h1>
        <p className="text-center text-muted-foreground">
          Discover new activities and resources for your wellness journey
        </p>
      </motion.div>

      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-semibold mb-2">Try Something New</h2>
          <p className="text-sm text-muted-foreground">
            Random wellness activities to brighten your day
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {randomActivities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      </section>

      <section>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-semibold mb-2">Recommended for You</h2>
          <p className="text-sm text-muted-foreground">
            Personalized resources based on your profile
          </p>
        </motion.div>

        {!recommendations || recommendations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-3xl border border-border"
          >
            <div className="w-16 h-16 rounded-full bg-lime/20 flex items-center justify-center mb-4">
              <Sprout className="w-8 h-8 text-lime" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              We're still learning about you! Complete your profile and check-ins to get
              personalized resource recommendations.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((resource, index) => (
              <ResourceCard key={resource.id} resource={resource} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}