
import QuestionOfTheDay from "@/lib/components/community/qotd";
import HomeLayout from "@/lib/components/home/home-layout";
import HomeLock from "@/lib/components/home/home-lock";
import StateLoader from "@/lib/components/home/state-loader";
import { apiFetch } from "@/lib/helpers/api-fetch";
import { QOTDResponseDto } from "@/lib/types/api-types";
import { User } from "@/lib/types/index";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Community | Serene",
};

export default async function page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["qotd"],
    queryFn: async () => (await apiFetch<QOTDResponseDto>("/community/qotd")).data!,
  });
  
  return (
      <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionOfTheDay />
      </HydrationBoundary>
  );
}