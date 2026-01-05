"use client";

import { SignupForm } from "@/lib/components/signup-form";
import { useTheme } from "next-themes";
import { useEffect } from "react";

interface SignupAuthPageProps {
  serverUrl: string;
}

export default function SignupAuthPage({ serverUrl }: SignupAuthPageProps) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
  }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <SignupForm serverUrl={serverUrl} />
      </div>
    </div>
  );
}
