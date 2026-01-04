import { SignupForm } from "@/lib/components/signup-form";
import { env } from "@/lib/env";
import { getSession } from "@/lib/get-session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Serene",
};

export default async function SignupPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/home");
  }

  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <SignupForm serverUrl={serverUrl} />
      </div>
    </div>
  );
}
