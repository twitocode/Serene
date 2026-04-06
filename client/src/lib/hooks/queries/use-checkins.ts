import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/helpers/api-fetch";
import type { CompleteCheckinRequest } from "@/lib/types/api-types";
import type { Checkin } from "@/lib/types/index";

export function useCheckinsQuery(date: string) {
	return useQuery<Checkin[]>({
		queryKey: ["checkins", date],
		queryFn: async () => {
			const res = await apiFetch<Checkin[]>(`/checkin?date=${date}`);
			if (!res.isSuccess || !res.data) {
				throw new Error(res.message ?? "Failed to fetch checkins");
			}
			return res.data;
		},
	});
}

export function useCompleteCheckinMutation(date: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CompleteCheckinRequest) => {
			return apiFetch(`/checkin?date=${date}`, {
				method: "POST",
				body: JSON.stringify(data),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["checkins", date],
			});
		},
	});
}
