// lib/api-fetch.ts
import { env } from "@/lib/env";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const isServer = typeof window === "undefined";

  // 1. Determine Base URL
  const baseUrl = isServer
    ? env.INTERNAL_SERVER_URL
    : env.NEXT_PUBLIC_SERVER_URL;

  // 2. Prepare Headers
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // 3. Server-Only Logic (Cookie Injection)
  if (isServer) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    headers.set("Cookie", cookieStore.toString());

    // Better Auth/CORS spoofing logic
    headers.set("Origin", env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  } else {
    // Client-Only Logic
    options.credentials = "include";
  }

  return fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });
}
