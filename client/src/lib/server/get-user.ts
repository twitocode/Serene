import { ApiError, apiFetch } from "@/lib/helpers/api-fetch";
import { User } from "@/lib/types/index";
import { redirect } from "next/navigation";

export async function getAuthUser(): Promise<User> {
  const user = await fetchUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function fetchUser(): Promise<User | null> {
  const result = await apiFetch<User>("/users/me");

  if (!result.isSuccess) {
    if (
      result.errorCode?.includes("401") ||
      result.errorCode === "UNAUTHORIZED"
    ) {
      return null;
    }
    throw new ApiError(result.message || "Failed to fetch user", 500, result);
  }

  return result.data;
}
