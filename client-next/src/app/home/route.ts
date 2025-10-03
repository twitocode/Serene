import type { Result } from "@/lib/types";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ACCESS_TOKEN")?.value;

  const res = await fetch(`${process.env.SERVER_URL}/mood/check-in`, {
    method: "GET",
    headers: {
      Cookie: `ACCESS_TOKEN=${accessToken}`,
    },
  });

  if (!res.ok) {
    console.log(await res.json());
  }

  const item = (await res.json()) as Result<boolean>;

  return {
    hasMoodCheckIn: item.value,
  };
}