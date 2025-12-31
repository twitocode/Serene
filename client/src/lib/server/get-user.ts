import { serverFetch } from "@/lib/helpers/fetch-server";
import { User } from "@/lib/types";
import { redirect } from "next/navigation";

export async function getUser(): Promise<User> {
  const res = await serverFetch(
    `/users/me`
  );

  if (!res.ok) {
    console.error("Login failed for some reason?");
    redirect("/login");
  }

  const data = await res.json(); //TODO: handle errors
  return data.user;
}
