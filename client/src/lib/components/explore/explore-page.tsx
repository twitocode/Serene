"use client"

import { useExploreRecommendations } from "@/lib/hooks/queries/use-explore";

export default function ExplorePage() {
  const {data: recommendations} = useExploreRecommendations();

  return (
    <div>
      {recommendations?.map(x => {

        return (
          <div key={x.id}>{x.url}</div>
        )
      })}
    </div>
  )
}