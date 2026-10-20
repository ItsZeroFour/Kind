import "server-only";
import { randomBytes } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { Jimp } from "jimp";
import { getDb, uploadsDir } from "./db";
import { sections, type Field } from "@/content/model";
import { getContent } from "@/content/store";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const acceptedTypes = ["image/jpeg", "image/png", "image/gif"];
const MAX_SIDE = 2400;

export type MediaItem = {
  id: number;
  url: string;
  original_name: string;
  width: number | null;
  height: number | null;
  size: number;
  created_at: string;
};

export async function saveUpload(input: Buffer, originalName: string): Promise<MediaItem> {
  // Pure-JS decoding (no native/WASM code): the VPS CPU lacks SSE4/WASM SIMD. EXIF orientation is applied on read.
  let img: Awaited<ReturnType<typeof Jimp.fromBuffer>>;
  try {
    img = await Jimp.fromBuffer(input);
  } catch {
    throw new Error("Not an image, or the format is not supported (JPG, PNG or GIF)");
  }
  const scale = Math.min(1, MAX_SIDE / img.width, MAX_SIDE / img.height);
  if (scale < 1) img.resize({ w: Math.round(img.width * scale), h: Math.round(img.height * scale) });

  // jimp has no WebP encoder: keep transparency as PNG, everything else becomes JPEG.
  const { data: px } = img.bitmap;
  let hasAlpha = false;
  for (let i = 3; i < px.length; i += 4) if (px[i] < 255) { hasAlpha = true; break; }
  const [mime, ext] = hasAlpha ? (["image/png", "png"] as const) : (["image/jpeg", "jpg"] as const);
  const data = mime === "image/png" ? await img.getBuffer(mime) : await img.getBuffer(mime, { quality: 84 });
  const info = { width: img.width, height: img.height };

  const file = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  await writeFile(path.join(uploadsDir, file), data);
  const name = originalName.slice(0, 200);
  const res = getDb()
    .prepare("INSERT INTO media (file, original_name, mime, width, height, size) VALUES (?, ?, ?, ?, ?, ?)")
    .run(file, name, mime, info.width, info.height, data.length);
  return {
    id: Number(res.lastInsertRowid),
    url: `/uploads/${file}`,
    original_name: name,
    width: info.width,
    height: info.height,
    size: data.length,
    created_at: new Date().toISOString(),
  };
}

export function listMedia(): MediaItem[] {
  const rows = getDb()
    .prepare("SELECT id, file, original_name, width, height, size, created_at FROM media ORDER BY id DESC")
    .all() as (Omit<MediaItem, "url"> & { file: string })[];
  return rows.map(({ file, ...r }) => ({ ...r, url: `/uploads/${file}` }));
}

export function mediaUsage(url: string): string[] {
  const content = getContent() as unknown as Record<string, unknown>;
  const used: string[] = [];
  const walk = (fields: Field[], value: unknown, prefix: string) => {
    for (const f of fields) {
      const v = f.key.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], value);
      if (f.kind === "image" && v === url) used.push(`${prefix} → ${f.label}`);
      if (f.kind === "list" && Array.isArray(v)) v.forEach((item, i) => walk(f.item, item, `${prefix} → ${f.label} #${i + 1}`));
    }
  };
  for (const s of sections) for (const g of s.groups) walk(g.fields, content[s.key], `${s.title} → ${g.title}`);
  return used;
}

export async function deleteMedia(id: number) {
  const db = getDb();
  const row = db.prepare("SELECT file FROM media WHERE id = ?").get(id) as { file: string } | undefined;
  if (!row) return { ok: true as const };
  const usedIn = mediaUsage(`/uploads/${row.file}`);
  if (usedIn.length) return { ok: false as const, error: `The image is in use: ${usedIn.join("; ")}. Replace it there first.` };
  db.prepare("DELETE FROM media WHERE id = ?").run(id);
  await unlink(path.join(uploadsDir, row.file)).catch(() => {});
  return { ok: true as const };
}
