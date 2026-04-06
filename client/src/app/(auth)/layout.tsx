import { redirect } from "next/navigation";
import { AuthNavbar } from "@/lib/components/common/auth-navbar";
import { getSession } from "@/lib/get-session";
import { checkOnboarding } from "@/lib/server/onboarding-server";

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
			<div className="relative z-10 mx-auto w-full max-w-lg px-5 pt-6 md:max-w-xl md:px-8 lg:max-w-2xl">
				<AuthNavbar />
			</div>
			<div className="absolute inset-0 flex items-center justify-center px-5 md:px-8 lg:px-12">
				<div className="w-full max-w-sm">{children}</div>
			</div>
		</div>
	);
}
