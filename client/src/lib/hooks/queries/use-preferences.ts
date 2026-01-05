import { apiFetch } from "@/lib/helpers/api-fetch";
import { Preferences, User } from "@/lib/types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UpdatePreferencesDto {
  theme?: string;
  passwordLock?: string;
}

export function usePreferencesQuery() {
  return useQuery<Preferences>({
    queryKey: ["preferences"],
    queryFn: async () => {
      // apiFetch automatically unwraps the 'data' property from the Result envelope.
      const res = await apiFetch<Preferences>("/preferences");
      return res.data!;
    },
  });
}

export function useUpdatePrefsMutation() {
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
