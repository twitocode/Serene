import type { Metadata } from "next";
import LoginAuthPage from "@/lib/components/auth/login-auth-page";

export const metadata: Metadata = {
	title: "Login | Serene",
};

export default function LoginPage() {
	return <LoginAuthPage />;
}
