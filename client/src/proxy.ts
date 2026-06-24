import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/dashboard"];
  const authRoutes = ["/"];

  // const token = request.cookies.get("better-auth.session_token");
  const token = request.cookies.get("__Secure-better-auth.session_token");

  /**  Неавторизован → пытается попасть в доску */
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  /**  Авторизован → пытается попасть на логин */
  if (token && authRoutes.some((route) => pathname === route)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
