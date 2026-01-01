import { ApiError, apiFetch } from "@/lib/helpers/api-fetch";
import { User } from "@serene/shared/types";
import { redirect } from "next/navigation";

export async function getAuthUser(): Promise<User> {
try {
  return await fetchUser();
} catch (error) {
  if (error instanceof ApiError && error.status === 401) {
    redirect("/login");
  }
  throw error;
}}

export async function fetchUser() {
  return await apiFetch<User>("/users/me");
}