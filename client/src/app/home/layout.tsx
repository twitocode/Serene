import HomeLayout from "@/lib/components/home/home-layout";
import HomeLock from "@/lib/components/home/home-lock";
import StateLoader from "@/lib/components/home/state-loader";
import { getSession } from "@/lib/get-session";
import { apiFetch } from "@/lib/helpers/api-fetch";
import { usePreferences } from "@/lib/hooks/queries/use-preferences";
import { fetchUser } from "@/lib/server/get-user";
import { checkOnboarding } from "@/lib/server/onboarding-server";
import { Preferences, User } from "@/lib/types/index";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function layout({
  children,
  data,
}: PropsWithChildren<any>) {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  const { completed } = await checkOnboarding();

  if (!completed) {
    redirect("/onboarding");
  }
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: async () => (await apiFetch<User>("/users/me")).data!,
  });

  await queryClient.prefetchQuery({
    queryKey: ["preferences"],
    queryFn: async () =>( await apiFetch<Preferences>("/preferences")).data!,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StateLoader>
        <HomeLayout children={children} />
        <HomeLock />
      </StateLoader>
    </HydrationBoundary>
  );
}
