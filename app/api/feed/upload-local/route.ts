import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

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
    case "video/mp4":
      return ".mp4";
    case "video/webm":
      return ".webm";
    case "video/quicktime":
      return ".mov";
    default:
      return "";
  }
}

/** ~4.5MB Vercel function body limit safety margin */
const VERCEL_MULTIPART_MAX = 4 * 1024 * 1024;
const LOCAL_MULTIPART_MAX = 80 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Use client upload when Blob is configured." },
      { status: 400 },
    );
  }

  const onVercel = Boolean(process.env.VERCEL);
  const maxBytes = onVercel ? VERCEL_MULTIPART_MAX : LOCAL_MULTIPART_MAX;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  if (!IMAGE_TYPES.has(file.type) && !VIDEO_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: onVercel
          ? "File too large for this deployment. Add BLOB_READ_WRITE_TOKEN (Vercel Blob) for larger uploads."
          : `File too large (max ${Math.floor(maxBytes / (1024 * 1024))}MB).`,
      },
      { status: 413 },
    );
  }

  const ext = extForMime(file.type);
  if (!ext) {
    return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "feed");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buf);

  const publicUrl = `/uploads/feed/${filename}`;
  return NextResponse.json({ url: publicUrl });
}
