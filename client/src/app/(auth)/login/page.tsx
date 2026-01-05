import LoginAuthPage from "@/lib/components/auth/login-auth-page";
import { env } from "@/lib/env";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Serene",
};

export default function LoginPage() {
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) return null;

  return <LoginAuthPage serverUrl={serverUrl} />;
}
