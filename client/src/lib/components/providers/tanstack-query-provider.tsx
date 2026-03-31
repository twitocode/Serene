// app/providers.tsx
"use client";

import {
	isServer,
	MutationCache,
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";
import { ApiError } from "@/lib/helpers/api-fetch";

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
				if (error instanceof ApiError) {
					if (error.status === 401) {
						if (typeof window !== "undefined") {
							window.location.href = "/login";
						}
					} else if (error.status >= 500) {
						toast.error("Server Error", {
							description: "Something went wrong on our end.",
						});
					}
				}
			},
		}),
		mutationCache: new MutationCache({
			onError: (error) => {
				if (error instanceof ApiError) {
					if (error.status === 401) {
						if (typeof window !== "undefined") {
							window.location.href = "/login";
						}
					} else if (error.status >= 500) {
						toast.error("Server Error", {
							description: "Something went wrong on our end.",
						});
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

export default function TanstackQueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
