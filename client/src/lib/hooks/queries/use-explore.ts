import { apiFetch } from "@/lib/helpers/api-fetch";
import { ExploreContent } from "@/lib/types/index";
import { useQuery } from "@tanstack/react-query";

export function useExploreRecommendations() {
  return useQuery<ExploreContent[]>({
    queryKey: ["explore-recommendations"],
    queryFn: async () => {
      const res = await apiFetch<ExploreContent[]>("/explore/recommendations");
      return res.data || [];
    },
  });
}

export function useSchoolResourcesQuery() {
  return useQuery<ExploreContent[]>({
    queryKey: ["explore-school-resources"],
    queryFn: async () => {
      const res = await apiFetch<ExploreContent[]>("/explore/school");
      return res.data || [];
    },
  });
}
