import { apiFetch } from "@/lib/helpers/api-fetch";
import { Settings, User } from "@/lib/types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UpdateSettingsDto {
  theme?: string;
  passwordLock?: string;
}

export function useSettingsQuery() {
  return useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await apiFetch<Settings>("/settings");
      if (!res.isSuccess || !res.data) {
        throw new Error(res.message ?? "Failed to fetch settings");
      }
      return res.data;
    },
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSettingsDto) => {
      const res = await apiFetch<Settings>("/settings", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.isSuccess || !res.data) {
        throw new Error(res.message ?? "Failed to update settings");
      }
      return res.data;
    },
    onSuccess: (newSettings) => {
      queryClient.setQueryData(["settings"], newSettings);
      queryClient.setQueryData(["user"], (oldUser: User) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          settings: newSettings,
        };
      });
    },
  });
}