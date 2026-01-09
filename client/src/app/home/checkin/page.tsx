import CheckinPage from "@/lib/components/checkin/checkin-page";
import { CheckinProvider } from "@/lib/components/providers/zustand-provider";
import { getRandomPrompt } from "@/lib/data/prompts";
import { apiFetch } from "@/lib/helpers/api-fetch";
import { getCurrentDate } from "@/lib/helpers/get-current-date";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkin | Serene",
};
export default async function page() {
  const queryClient = new QueryClient();

  const today = getCurrentDate();
  await queryClient.prefetchQuery({
    queryKey: ["checkins", today],
    queryFn: async () => (await apiFetch(`/checkin?date=${today}`)).data!,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckinProvider
        initialDisplayDate={today}
        initialPromptQuestion={getRandomPrompt().question}
      >
        <CheckinPage />
      </CheckinProvider>
    </HydrationBoundary>
  );
}
