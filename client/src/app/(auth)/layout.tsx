import { AuthNavbar } from "@/lib/components/common/auth-navbar";
import { getSession } from "@/lib/get-session";
import { checkOnboarding } from "@/lib/server/onboarding-server";
import { redirect } from "next/navigation";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (session?.user) {
    const { completed } = await checkOnboarding();

    if (completed) {
      redirect("/home");
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <div className="relative min-h-svh mesh-sanctuary">
      <div className="mx-auto max-w-lg px-5 pb-16 pt-6 md:max-w-xl md:px-8 lg:max-w-2xl">
        <AuthNavbar />
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
