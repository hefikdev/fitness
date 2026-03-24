import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const protectedPattern = /^\/a(\/|$)/;
const onboardingPath = "/onboarding";
const authPaths = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let auth API routes pass through without interception
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = await auth.api
    .getSession({ headers: request.headers })
    .catch(() => null);

  const isProtected = protectedPattern.test(pathname) || pathname === onboardingPath;
  const isAuthPath = authPaths.includes(pathname);

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/a/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|svg|ico)$).*)"],
};
