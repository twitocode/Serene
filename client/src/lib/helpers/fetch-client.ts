// lib/api/client-fetch.ts (for Client Components)
export async function clientFetch(endpoint: string, options: RequestInit = {}) {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
    ...options,
    credentials: "include", // Browser handles cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
