import "server-only";

export function clientIp(headers: Headers) {
  return headers.get("x-real-ip") || headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "local";
}

export function isCrossSite(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return true;
  }
}

export function bodyTooLarge(req: Request, maxBytes: number) {
  return Number(req.headers.get("content-length") ?? 0) > maxBytes;
}
