import { apiFetch } from "@/lib/helpers/api-fetch";
import { User } from "@/lib/types/index";
import { useQuery } from "@tanstack/react-query";

export function useUserQuery() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await apiFetch<User>("/users/me");
      return res.data!;
    },
  });
}
