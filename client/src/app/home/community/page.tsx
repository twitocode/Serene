import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import QuestionOfTheDay from "@/lib/components/community/qotd";
import { apiFetch } from "@/lib/helpers/api-fetch";
import { QOTDAnswerDto, type QOTDResponseDto } from "@/lib/types/api-types";

export const metadata: Metadata = {
	title: "Community | Serene",
};

export default async function page() {
	const queryClient = new QueryClient();

	// Fetch QOTD for today
	await queryClient.prefetchQuery({
		queryKey: ["qotd", undefined],
		queryFn: async () =>
			(await apiFetch<QOTDResponseDto>("/community/qotd")).data!,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<QuestionOfTheDay />
		</HydrationBoundary>
	);
}
