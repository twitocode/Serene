import { User } from "@/lib/types";
import { log } from "console";
import { redirect } from "next/navigation";

export async function getUser(): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/session`);

  if (!res.ok) {
    redirect("/login");
  }



  const data = await res.json(); //TODO: handle errors
  return data.user;
}
