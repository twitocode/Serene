import HomeLayout from "@/lib/components/home/home-layout";
import HomeLock from "@/lib/components/home/home-lock";
import StateLoader from "@/lib/components/home/state-loader";
import { getSession } from "@/lib/get-session";
import { getUser } from "@/lib/server/get-user";
import { checkOnboarding } from "@/lib/server/onboarding-server";
import { PropsWithChildren } from "react";

export default async function layout({
  children,
  data,
}: PropsWithChildren<any>) {
  const session = await getSession();
  console.log("From home page: ", session);
  if (!session || !session.user) {
    console.log("From home page: session does not exist");
    setTimeout(() => {
      //redirect("/login");
    }, 2000);
  }

  const { completed } = await checkOnboarding();

  if (!completed) {
    console.log("From home page, user still needs to onboard");
    setTimeout(() => {
      // redirect("/onboarding");
    }, 2000);
  }
  const user = await getUser();
  return (
    <StateLoader user={user}>
      <HomeLayout children={children} user={user} />
      <HomeLock />
    </StateLoader>
  );
}
