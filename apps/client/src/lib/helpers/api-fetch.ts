import { env } from "@/lib/env";
// ❌ REMOVED: import { headers as nextHeaders } from "next/headers";

// 1. Custom Error for better handling in UI components
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiFetchOptions extends RequestInit {
  skipUnwrap?: boolean; // Option to bypass the auto-unwrapping
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  { skipUnwrap = false, ...options }: ApiFetchOptions = {}
): Promise<T> {
  const isServer = typeof window === "undefined";

  // Select URL based on environment
  const baseUrl = isServer
    ? env.INTERNAL_SERVER_URL // Docker/Localhost internal URL
    : env.NEXT_PUBLIC_SERVER_URL; // Public domain

  // Prepare Headers
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // Server-side: Propagate Auth & Origin
  if (isServer) {
    // We only call the cookie helper on the server
    const cookieStore = await getCookiesDynamically();

    // cookieStore.toString() formats it correctly as a Cookie header string
    headers.set("Cookie", cookieStore.toString());

    // Required for Better Auth/NextAuth to verify origin on server-to-server calls
    headers.set("Origin", env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  } else {
    // Client-side: Include credentials (cookies) automatically
    options.credentials = "include";
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  // 2. Handle Errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new ApiError(
      errorData?.message ||
        response.statusText ||
        "An unexpected error occurred",
      response.status,
      errorData
    );
  }

  // 3. Handle Response
  // Return empty object if status is 204 (No Content)
  if (response.status === 204) {
    return {} as T;
  }

  const json = await response.json();

  // 4. "Magic" Unwrap
  if (!skipUnwrap) {
    const keys = Object.keys(json);
    if (keys.length === 1) {
      return json[keys[0]];
    }
  }

  return json;
}

// Helper: Dynamically import next/headers ONLY when called.
// This prevents the "next/headers" import from crashing the browser bundle.
async function getCookiesDynamically() {
  const { cookies } = await import("next/headers");
  return cookies();
}
