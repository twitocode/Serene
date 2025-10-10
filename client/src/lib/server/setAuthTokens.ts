import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import * as setCookie from "set-cookie-parser";

export function setAuthTokens(cookies: ReadonlyRequestCookies, res: Response) {
  // res is a fetch() response from your backend API
  const rawSetCookies = res.headers.get("set-cookie");

  if (!rawSetCookies) return "";

  // Parse with map mode
  const cookiesFromBackend = setCookie.parse(rawSetCookies, { map: true });

  if (cookiesFromBackend.ACCESS_TOKEN) {
    cookies.set("ACCESS_TOKEN", cookiesFromBackend.ACCESS_TOKEN.value, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: cookiesFromBackend.ACCESS_TOKEN.expires,
    });
  }

  if (cookiesFromBackend.REFRESH_TOKEN) {
    cookies.set("REFRESH_TOKEN", cookiesFromBackend.REFRESH_TOKEN.value, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: cookiesFromBackend.REFRESH_TOKEN.expires,
    });
  }

  return cookiesFromBackend.ACCESS_TOKEN?.value ?? "";
}
