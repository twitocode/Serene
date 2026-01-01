import { apiFetch } from "@/lib/helpers/api-fetch";
import { User } from "@serene/shared/types";
import { redirect } from "next/navigation";

export async function getUser(): Promise<User> {
  const res = await apiFetch(`/users/me`);

  if (res.status === 401) {
    if (typeof window === "undefined") redirect("/login");
    else window.location.href = "/login";
  }

  if (!res.ok) throw new Error("Failed to fetch user");

  const data = await res.json(); //TODO: handle errors
  return data.user;
}
