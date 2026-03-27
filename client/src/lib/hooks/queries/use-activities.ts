import { apiFetch } from "@/lib/helpers/api-fetch";
import {
  ActivityResponse,
  CompleteActivityRequest,
  CreateActivityRequest,
} from "@/lib/types/api-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useActivitiesQuery(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  return useQuery<ActivityResponse[]>({
    queryKey: ["activities", from, to],
    queryFn: async () => {
      const res = await apiFetch<ActivityResponse[]>(
        `/activities?${params.toString()}`,
      );
      return res.data ?? [];
    },
  });
}

export function useCreateActivityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateActivityRequest) => {
      const res = await apiFetch<ActivityResponse>("/activities", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.isSuccess)
        throw new Error(res.message || "Failed to create activity");
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}

export function useCompleteActivityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: CompleteActivityRequest & { id: string }) => {
      const res = await apiFetch<ActivityResponse>(
        `/activities/${id}/complete`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );
      if (!res.isSuccess)
        throw new Error(res.message || "Failed to complete activity");
      return res.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}

export function useDeleteActivityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch<boolean>(`/activities/${id}`, {
        method: "DELETE",
      });
      if (!res.isSuccess)
        throw new Error(res.message || "Failed to delete activity");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}
