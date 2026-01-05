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
    <div className=" mx-40 mt-5">
      <AuthNavbar />
      {children}
    </div>
  );
}
