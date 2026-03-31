import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/helpers/api-fetch";
import type { AchievementWithStatus } from "@/lib/types/api-types";

export function useAchievementsQuery() {
	return useQuery<AchievementWithStatus[]>({
		queryKey: ["achievements"],
		queryFn: async () => {
			const res = await apiFetch<AchievementWithStatus[]>("/achievements");
			return res.data ?? [];
		},
	});
}
