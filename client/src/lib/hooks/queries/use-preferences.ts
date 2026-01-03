import { apiFetch } from "@/lib/helpers/api-fetch";
import { Preferences, User } from "@/lib/types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UpdatePreferencesDto {
  theme?: string;
  passwordLock?: string;
}

export function usePreferences() {
  return useQuery<Preferences>({
    queryKey: ["preferences"],
    queryFn: async () => {
      const prefs = await apiFetch<Preferences>("/preferences");
      return prefs;
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePreferencesDto) => {
      return apiFetch<Preferences>("/users/preferences", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (newPreferences) => {
      queryClient.setQueryData(["preferences"], newPreferences);
      queryClient.setQueryData(["user"], (oldUser: User) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          preferences: newPreferences,
        };
      });
    },
  });
}
