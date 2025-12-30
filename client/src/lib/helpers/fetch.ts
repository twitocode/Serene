// lib/api/server-fetch.ts (for Server Components)
import { cookies } from "next/headers";

export async function serverFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
    ...options,
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store", // Important for auth data
  });
}

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
