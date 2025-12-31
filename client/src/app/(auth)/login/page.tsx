import { LoginForm } from "@/lib/components/login-form";
import { getSession } from "@/lib/get-session";
import { checkOnboarding } from "@/lib/server/onboarding-server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getSession();
  console.log("From login page:", session);
  if (session?.user) {
    // Check onboarding status
    const { completed } = await checkOnboarding();
    console.log("From login page, Completed?:", completed)

    if (completed) {
      console.log("From login page: does not need onboarding")
      redirect("/home");
    } else {
      console.log("From login page: still needs onboarding")
      redirect("/onboarding");
    }
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) return null;

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-sm">
        <LoginForm serverUrl={serverUrl} />
      </div>
    </div>
  );
}
