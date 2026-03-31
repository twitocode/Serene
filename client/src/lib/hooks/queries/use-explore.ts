import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/helpers/api-fetch";
import type { ExploreContent } from "@/lib/types/index";

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
