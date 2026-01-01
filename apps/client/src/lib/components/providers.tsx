// app/providers.tsx
"use client";

import { ApiError } from "@/lib/helpers/api-fetch";
import {
  isServer,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Set a staleTime > 0 to avoid immediate refetching on the client
        staleTime: 60 * 1000,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof ApiError && error.status === 401) {
          console.error("User is not logged in ");
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      },
    }),
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children} 
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
