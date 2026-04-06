"use client";

import { SignupForm } from "@/lib/components/signup-form";

interface SignupAuthPageProps {
	serverUrl: string;
}

export default function SignupAuthPage({ serverUrl }: SignupAuthPageProps) {
	return (
		<div className="card-glass w-full p-8 shadow-lg">
			<SignupForm serverUrl={serverUrl} />
		</div>
	);
}
