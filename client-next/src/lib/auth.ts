import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function resetAuth() {
  const c = await cookies();
  c.delete("ACCESS_TOKEN");
  c.delete("REFRESH_TOKEN");
  c.delete("Identity.External");
}

export async function setAuthTokens(res: Response) {
  const setCookieHeaders = res.headers.getSetCookie?.();
  const c = await cookies();

  if (!setCookieHeaders) return null;

  // parse manually or with set-cookie-parser
  for (const header of setCookieHeaders) {
    const match = header.match(/^(.*?)=(.*?);/);
    if (!match) continue;
    const [_, key, value] = match;

    c.set(key, value, { path: "/" });
  }

  return c.get("ACCESS_TOKEN")?.value ?? null;
}

export async function refreshAccessToken(): Promise<string | null> {
  const c = await cookies();
  const refreshToken = c.get("REFRESH_TOKEN")?.value;
  if (!refreshToken) {
    resetAuth();
    return null;
  }

  const res = await fetch(`${process.env.SERVER_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      Cookie: `REFRESH_TOKEN=${refreshToken}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    resetAuth();
    return null;
  }

  return await setAuthTokens(res);
}

export async function getAuthenticatedUser(token: string) {
  const res = await fetch(`${process.env.SERVER_URL}/users`, {
    headers: {
      Cookie: `ACCESS_TOKEN=${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    resetAuth();
    return null;
  }

  const data = await res.json();
  return data.value;
}
