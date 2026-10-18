import { readFile } from "node:fs/promises";
import path from "node:path";
import { uploadsDir } from "@/lib/db";

const types: Record<string, string> = { webp: "image/webp", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const ext = /^[\w-]+\.(\w+)$/.exec(file)?.[1]?.toLowerCase();
  if (!ext || !types[ext]) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(path.join(uploadsDir, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": types[ext],
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Security-Policy": "default-src 'none'",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
