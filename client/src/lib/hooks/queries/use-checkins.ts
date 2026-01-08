import { apiFetch } from "@/lib/helpers/api-fetch";
import { Checkin, Preferences } from "@/lib/types/index";
import { useQuery } from "@tanstack/react-query";

export function useCheckinsQuery(date: string) {
  return useQuery<Checkin[]>({
    queryKey: ["checkins", date],
    queryFn: async () => {
      const res = await apiFetch<Checkin[]>(`/checkin?date=${date}`);
      return res.data!;
    },
  });
}
