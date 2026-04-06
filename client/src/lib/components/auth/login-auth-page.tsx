"use client";

import { LoginForm } from "@/lib/components/login-form";

interface LoginAuthPageProps {
	serverUrl: string;
}

export default function LoginAuthPage({ serverUrl }: LoginAuthPageProps) {
	return (
		<div className="card-glass w-full p-8 shadow-lg">
			<LoginForm serverUrl={serverUrl} />
		</div>
	);
}
