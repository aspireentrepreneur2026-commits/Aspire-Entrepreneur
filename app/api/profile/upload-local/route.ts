import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

function resolvedMime(file: File): string | null {
  let t = file.type.trim().toLowerCase();
  if (t === "image/jpg" || t === "image/pjpeg") t = "image/jpeg";
  if (t === "image/x-png") t = "image/png";
  if (IMAGE_TYPES.has(t)) return t;
  const ext = path.extname(file.name).toLowerCase();
  const byExt: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return byExt[ext] ?? null;
}

function extForMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    default:
      return "";
  }
}

const LOCAL_MAX = 15 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Use client Blob upload for profile images when Blob is configured." },
        { status: 400 },
      );
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: "Add BLOB_READ_WRITE_TOKEN for profile image uploads on Vercel." },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 });
    }

    const mime = resolvedMime(file);
    if (!mime) {
      return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
    }

    if (file.size > LOCAL_MAX) {
      return NextResponse.json({ error: "Image too large (max 15MB)." }, { status: 413 });
    }

    const ext = extForMime(mime);
    if (!ext) {
      return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "profile");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buf);

    return NextResponse.json({ url: `/uploads/profile/${filename}` });
  } catch (e) {
    console.error("[profile-upload-local]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 500 },
    );
  }
}
