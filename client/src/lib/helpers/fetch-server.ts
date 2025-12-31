import { cookies } from "next/headers";

export async function serverFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return fetch(`${process.env.INTERNAL_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Cookie: cookieHeader,
      "Content-Type": "application/json",
      // FIX: Spoof these headers to match your Client/Better Auth config
      Origin: "http://localhost:3000",
      Host: "localhost:8000",
      ...options.headers,
    },
    cache: "no-store",
  });
}
