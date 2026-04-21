import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import HomeLayout from "@/lib/components/home/home-layout";
import HomeLock from "@/lib/components/home/home-lock";
import StateLoader from "@/lib/components/home/state-loader";
import { ThemeProvider } from "@/lib/components/providers/theme-provider";
import { CheckinProvider } from "@/lib/components/providers/zustand-provider";
import { getSession } from "@/lib/get-session";
import { apiFetch } from "@/lib/helpers/api-fetch";
import { getCurrentDate } from "@/lib/helpers/get-current-date";
import type { Settings, User } from "@/lib/types/index";

export default async function AdminLayout({ children }: PropsWithChildren) {
	const session = await getSession();

	if (!session?.user?.data?.roles?.includes("Admin")) {
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
			<StateLoader>
				<CheckinProvider initialDisplayDate={getCurrentDate()}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<HomeLayout>{children}</HomeLayout>
						<HomeLock />
					</ThemeProvider>
				</CheckinProvider>
			</StateLoader>
		</HydrationBoundary>
	);
}
