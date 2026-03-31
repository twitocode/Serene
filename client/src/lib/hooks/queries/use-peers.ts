import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/helpers/api-fetch";
import type {
	PeerMatchResponse,
	UpdateInterestsRequest,
} from "@/lib/types/api-types";

export function useInterestsQuery() {
	return useQuery<string[]>({
		queryKey: ["interests"],
		queryFn: async () => {
			const res = await apiFetch<string[]>("/community/interests");
			return res.data ?? [];
		},
	});
}

export function useUpdateInterestsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: UpdateInterestsRequest) => {
			const res = await apiFetch<void>("/community/interests", {
				method: "POST",
				body: JSON.stringify(data),
			});
			if (!res.isSuccess) {
				throw new Error(res.message || "Failed to update interests");
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["interests"] });
			queryClient.invalidateQueries({ queryKey: ["peer-match"] });
		},
	});
}

export function usePeerMatchQuery(enabled: boolean = true) {
	return useQuery<PeerMatchResponse | null>({
		queryKey: ["peer-match"],
		queryFn: async () => {
			const res = await apiFetch<PeerMatchResponse>("/community/peers/match");
			return res.data ?? null;
		},
		enabled,
	});
}
