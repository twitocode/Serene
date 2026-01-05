import QuestionOfTheDay from "@/lib/components/community/qotd";
import { apiFetch } from "@/lib/helpers/api-fetch";
import { QOTDAnswerDto, QOTDResponseDto } from "@/lib/types/api-types";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | Serene",
};

export default async function page() {
  const queryClient = new QueryClient();

  // Fetch QOTD for today
  await queryClient.prefetchQuery({
    queryKey: ["qotd", undefined],
    queryFn: async () =>
      (
        await apiFetch<QOTDResponseDto>("/community/qotd")
      ).data!,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionOfTheDay />
    </HydrationBoundary>
  );
}
