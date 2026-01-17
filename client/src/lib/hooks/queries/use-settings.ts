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
      // apiFetch automatically unwraps the 'data' property from the Result envelope.
      const res = await apiFetch<Settings>("/settings");
      return res.data!;
    },
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSettingsDto) => {
      return apiFetch<Settings>("/users/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      });
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