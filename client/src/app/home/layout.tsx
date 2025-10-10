import HomeLayout from "@/lib/components/home/HomeLayout";
import HomeLock from "@/lib/components/home/HomeLock";
import StateLoader from "@/lib/components/home/StateLoader";
import { getUser } from "@/lib/server/getUser";
import { Result } from "@/lib/types";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";

export default async function layout({
  children,
  data,
}: PropsWithChildren<any>) {
  async function loadData() {
    const user = await getUser();

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
      user,
    };
  }

  const { user, hasMoodCheckIn } = await loadData();

  return (
    <StateLoader user={user}>
      <HomeLayout children={children} user={user} />
      <HomeLock />
    </StateLoader>
  );
}
