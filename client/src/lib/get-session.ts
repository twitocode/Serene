import { cookies } from "next/headers";

export async function getSession() {
  try {
    const cookieStore = await cookies();

    // Get all cookies and format them for the request
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/get-session`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}
