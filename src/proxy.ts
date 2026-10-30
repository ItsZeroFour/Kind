import { NextResponse, type NextRequest } from "next/server";
import { findRedirect } from "@/lib/redirects";

export function proxy(req: NextRequest) {
  const to = findRedirect(req.nextUrl.pathname, req.nextUrl.search);
  if (!to) return NextResponse.next();
  // Behind nginx the app itself listens on http://127.0.0.1, so the public scheme and host come from the headers nginx sets.
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0].trim() || req.nextUrl.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl.host;
  return NextResponse.redirect(new URL(to, `${proto}://${host}`), 301);
}

export const config = {
  matcher: ["/((?!_next/|api/|admin|uploads/|images/|.*\\.\\w+$).*)"],
};
