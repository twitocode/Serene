import { Result, User } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ACCESS_TOKEN")?.value;
  console.log(process.env.SERVER_URL);

  if (!accessToken) {
    redirect("/login");
  }
  const res = await fetch(`${process.env.SERVER_URL}/users`, {
    method: "GET",
    headers: {
      Cookie: `ACCESS_TOKEN=${accessToken}`,
    },
  });

  if (!res.ok) {
    redirect("/login");
  }

  const data = (await res.json()) as Result<User>; //TODO: handle errors
  return data.value;
}
