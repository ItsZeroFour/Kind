import { NextResponse, type NextRequest } from "next/server";
import { findRedirect } from "@/lib/redirects";

export function proxy(req: NextRequest) {
  const to = findRedirect(req.nextUrl.pathname, req.nextUrl.search);
  if (!to) return NextResponse.next();
  // behind nginx: take scheme/host from forwarded headers
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0].trim() || req.nextUrl.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl.host;
  return NextResponse.redirect(new URL(to, `${proto}://${host}`), 301);
}

export const config = {
  matcher: ["/((?!_next/|api/|admin|uploads/|images/|.*\\.\\w+$).*)"],
};
