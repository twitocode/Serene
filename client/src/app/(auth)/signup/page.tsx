import type { Metadata } from "next";
import SignupAuthPage from "@/lib/components/auth/signup-auth-page";
import { env } from "@/lib/env";

export const metadata: Metadata = {
	title: "Signup | Serene",
};

export default function SignupPage() {
	const serverUrl = env.NEXT_PUBLIC_SERVER_URL;
	if (!serverUrl) return null;

	return <SignupAuthPage serverUrl={serverUrl} />;
}
