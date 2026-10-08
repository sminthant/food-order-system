import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "foodgo_session";

function needsAccount(pathname: string) {
  return (
    pathname === "/menu" ||
    pathname.startsWith("/menu/") ||
    pathname.startsWith("/food/") ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname === "/orders" ||
    pathname.startsWith("/orders/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!needsAccount(pathname) || request.cookies.get(SESSION_COOKIE)?.value) {
    return NextResponse.next();
  }

  const login = request.nextUrl.clone();
  login.pathname = "/login";
  login.search = "";
  login.searchParams.set("next", pathname);
  const response = NextResponse.redirect(login);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: [
    "/menu",
    "/menu/:path*",
    "/food/:path*",
    "/cart",
    "/checkout",
    "/orders",
    "/orders/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
