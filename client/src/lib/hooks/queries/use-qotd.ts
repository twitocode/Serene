import { apiFetch } from "@/lib/helpers/api-fetch";
import { QOTDAnswerDto, QOTDResponseDto } from "@/lib/types/api-types";
import { useQuery } from "@tanstack/react-query";

export function useQOTD(date?: string) {
  return useQuery<QOTDResponseDto>({
    queryKey: ["qotd", date],
    queryFn: async () => {
      const res = await apiFetch<QOTDResponseDto>(
        `/community/qotd${date ? `?date=${date}` : ""}`
      );
      return res.data!;
    },
  });
}

export function useQOTDResponses(date: string) {
  return useQuery<QOTDAnswerDto[]>({
    queryKey: ["qotd", "responses", date],
    queryFn: async () => {
      const res = await apiFetch<QOTDAnswerDto[]>(
        `/community/qotd/${date}/responses`
      );
      return res.data!;
    },
    enabled: !!date,
  });
}
