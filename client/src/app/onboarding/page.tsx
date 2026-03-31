import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnBoardingNavbar } from "@/lib/components/common/onboarding-navbar";
import { OnboardingFlow } from "@/lib/components/onboarding/onboarding-flow";
import { OnboardingProvider } from "@/lib/components/providers/zustand-provider";
import { getSession } from "@/lib/get-session";
import { apiFetch } from "@/lib/helpers/api-fetch";
import { checkOnboarding } from "@/lib/server/onboarding-server";
import type { Settings, User } from "@/lib/types/index";

export const metadata: Metadata = {
	title: "Onboarding | Serene",
};

export default async function OnboardingPage() {
	const session = await getSession();
	if (!session?.user) {
		redirect("/");
	}
	const { step, completed, started, ...rest } = await checkOnboarding();
	if (completed) {
		redirect("/home");
	}
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["user"],
		queryFn: async () => (await apiFetch<User>("/users/me")).data!,
	});

	await queryClient.prefetchQuery({
		queryKey: ["settings"],
		queryFn: async () => (await apiFetch<Settings>("/settings")).data!,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="mx-5 lg:mx-40 mt-5">
				<OnBoardingNavbar />
				<OnboardingProvider
					initialStep={step}
					initialHasStarted={started}
					initialName={rest.name || ""}
					initialDateOfBirth={rest.dateOfBirth}
					initialGender={rest.gender || ""}
					initialPronouns={rest.pronouns || ""}
					initialCountryCode={rest.countryCode || ""}
					initialSchool={rest.schoolName || ""}
					initialMochiName={rest.mochiName || ""}
					initialMochiPronouns={rest.mochiPronouns || ""}
				>
					<OnboardingFlow />
				</OnboardingProvider>
			</div>
		</HydrationBoundary>
	);
}
