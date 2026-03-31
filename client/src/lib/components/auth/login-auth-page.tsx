"use client";

import { LoginForm } from "@/lib/components/login-form";

interface LoginAuthPageProps {
	serverUrl: string;
}

export default function LoginAuthPage({ serverUrl }: LoginAuthPageProps) {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
			<div className="w-full max-w-sm">
				<LoginForm serverUrl={serverUrl} />
			</div>
		</div>
	);
}
