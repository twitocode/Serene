import { env } from "@/lib/env";
import { Result } from "../types/api-types";

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

export async function apiFetch<T = void>(
  endpoint: string,
  options: RequestInit = {}
): Promise<Result<T>> {
  const isServer = typeof window === "undefined";

  // Select URL based on environment
  const baseUrl = isServer
    ? env.INTERNAL_SERVER_URL
    : env.NEXT_PUBLIC_SERVER_URL;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (isServer) {
    const cookieStore = await getCookiesDynamically();
    const cookieString = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    headers.set("Cookie", cookieString);
    headers.set("Origin", env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  } else {
    options.credentials = "include";
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // 204 No Content
    if (response.status === 204) {
      return { isSuccess: true, data: null };
    }

    const json = await response.json().catch(() => null);

    if (json && typeof json === "object" && "isSuccess" in json) {
      return json as Result<T>;
    }

    // ASP.NET ProblemDetails (RFC 7807)
    if (!response.ok && json && (json.title || json.errors)) {
      return {
        isSuccess: false,
        data: null,
        message: json.title || json.detail || "Validation failed",
        errorCode: json.type || "VALIDATION_ERROR",
        errors: json.errors,
      };
    }

    if (response.ok) {
      return { isSuccess: true, data: json as T };
    }

    //generic http
    return {
      isSuccess: false,
      data: null,
      message: response.statusText || "An unexpected error occurred",
      errorCode: `HTTP_${response.status}`,
    };
  } catch (error) {
    return {
      isSuccess: false,
      data: null,
      message:
        error instanceof Error ? error.message : "Network request failed",
      errorCode: "NETWORK_ERROR",
    };
  }
}

async function getCookiesDynamically() {
  const { cookies } = await import("next/headers");
  return cookies();
}
