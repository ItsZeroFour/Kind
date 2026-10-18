import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { MAX_UPLOAD_BYTES, saveUpload } from "@/lib/media";
import { bodyTooLarge, isCrossSite } from "@/lib/request";

export async function POST(req: Request) {
  if (!req.headers.get("origin") || isCrossSite(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!(await getUser())) return NextResponse.json({ error: "Please sign in again" }, { status: 401 });
  if (bodyTooLarge(req, MAX_UPLOAD_BYTES + 64 * 1024)) return NextResponse.json({ error: "The file is over 15 MB" }, { status: 413 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received" }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "The file is over 15 MB" }, { status: 413 });

  try {
    const item = await saveUpload(Buffer.from(await file.arrayBuffer()), file.name);
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save the file" }, { status: 400 });
  }
}
