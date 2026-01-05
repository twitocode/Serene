"use client";

import { LoginForm } from "@/lib/components/login-form";
import { useTheme } from "next-themes";
import { useEffect } from "react";

interface LoginAuthPageProps {
  serverUrl: string;
}

export default function LoginAuthPage({ serverUrl }: LoginAuthPageProps) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
  }, []);
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-sm">
        <LoginForm serverUrl={serverUrl} />
      </div>
    </div>
  );
}
