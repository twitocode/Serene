import { getSession } from "@/lib/get-session";
import { checkOnboarding } from "@/lib/server/onboarding";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function page({ children, data }: PropsWithChildren<any>) {
  const session = await getSession();
  const { step, completed } = await checkOnboarding();

  if (!session?.user) {
    redirect("/login");
  }
  if (completed) {
    redirect("/home");
  }

  return children;
}
