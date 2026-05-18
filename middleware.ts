import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/api/bookmarks"];
const PROTECTED_PAGES = ["/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedPage = PROTECTED_PAGES.some((p) => pathname.startsWith(p));
  const isProtectedApi = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const authHeaderToken = req.headers.get("authorization")?.startsWith("Bearer ")
    ? req.headers.get("authorization")?.slice(7)
    : undefined;
  const token = req.cookies.get("token")?.value ?? authHeaderToken;

  if (!token) {
    if (isProtectedPage) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
