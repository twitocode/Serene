import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import {
  refreshAccessToken,
  getAuthenticatedUser,
  resetAuth,
} from "@/lib/auth";

const publicRoutes = ["/", "/login", "/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // logout
  if (pathname === "/logout") {
    await resetAuth();
    return NextResponse.redirect(new URL("/", req.url));
  }

  // login callback bypass
  if (pathname === "/login/callback") {
    return NextResponse.next();
  }

  let token = req.cookies.get("ACCESS_TOKEN")?.value ?? null;

  // if no token or expired → try refresh
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        token = await refreshAccessToken();
      }
    } catch {
      token = await refreshAccessToken();
    }
  } else {
    token = await refreshAccessToken();
  }

  // Public route logic
  if (publicRoutes.includes(pathname)) {
    console.log(`trying to redirect to ${pathname}`)
    if (token) {
      const user = await getAuthenticatedUser(token);
      if (user) {
        if (!user.isSetupCompleted) {
          return NextResponse.redirect(new URL("/setup-profile", req.url));
        }
        return NextResponse.redirect(new URL("/home", req.url));
      }
    }

    console.log(`going to ${pathname}`)
    return NextResponse.next();
  }

  // Protected route logic
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = await getAuthenticatedUser(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!user.isSetupCompleted && pathname !== "/setup-profile") {
    return NextResponse.redirect(new URL("/setup-profile", req.url));
  }
  if (user.isSetupCompleted && pathname === "/setup-profile") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // apply to all routes
};
