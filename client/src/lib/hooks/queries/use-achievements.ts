import { apiFetch } from "@/lib/helpers/api-fetch";
import { AchievementWithStatus } from "@/lib/types/api-types";
import { useQuery } from "@tanstack/react-query";

export function useAchievementsQuery() {
  return useQuery<AchievementWithStatus[]>({
    queryKey: ["achievements"],
    queryFn: async () => {
      const res = await apiFetch<AchievementWithStatus[]>("/achievements");
      return res.data ?? [];
    },
  });
}
