"use client";

import { SignupForm } from "@/lib/components/signup-form";

interface SignupAuthPageProps {
	serverUrl: string;
}

export default function SignupAuthPage({ serverUrl }: SignupAuthPageProps) {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6">
			<div className="card-glass w-full max-w-sm p-8 shadow-lg">
				<SignupForm serverUrl={serverUrl} />
			</div>
		</div>
	);
}
