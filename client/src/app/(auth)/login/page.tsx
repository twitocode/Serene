import { LoginForm } from "@/lib/components/login-form";
import { env } from "@/lib/env";
import { getSession } from "@/lib/get-session";
import { checkOnboarding } from "@/lib/server/onboarding-server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Serene",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session?.user) {
    const { completed } = await checkOnboarding();

    if (completed) {
      redirect("/home");
    } else {
      redirect("/onboarding");
    }
  }

  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) return null;

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-sm">
        <LoginForm serverUrl={serverUrl} />
      </div>
    </div>
  );
}
