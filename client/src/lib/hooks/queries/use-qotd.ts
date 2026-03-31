import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/helpers/api-fetch";
import type {
	QOTDAnswerDto,
	QOTDPostDto,
	QOTDResponseDto,
} from "@/lib/types/api-types";

export function useQOTDQuery(date?: string) {
	return useQuery<QOTDResponseDto>({
		queryKey: ["qotd", date],
		queryFn: async () => {
			const res = await apiFetch<QOTDResponseDto>(
				`/community/qotd${date ? `?date=${date}` : ""}`,
			);
			return res.data!;
		},
	});
}

export function useQOTDResponsesQuery(date: string) {
	return useQuery<QOTDAnswerDto[]>({
		queryKey: ["qotd", "responses", date],
		queryFn: async () => {
			const res = await apiFetch<QOTDAnswerDto[]>(
				`/community/qotd/${date}/responses`,
			);
			return res.data!;
		},
		enabled: !!date,
	});
}

export function useQOTDResponseMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: QOTDPostDto) => {
			const res = await apiFetch<void>("/community/qotd", {
				method: "POST",
				body: JSON.stringify(data),
			});
			if (!res.isSuccess) {
				throw new Error(res.message || "Failed to submit answer");
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["qotd", "responses"] });
		},
	});
}
