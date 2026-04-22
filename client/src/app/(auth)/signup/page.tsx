import type { Metadata } from "next";
import SignupAuthPage from "@/lib/components/auth/signup-auth-page";

export const metadata: Metadata = {
	title: "Signup | Serene",
};

export default function SignupPage() {
	return <SignupAuthPage />;
}
