import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

/** App Router defaults to Node; pin so fs writes never run on Edge. */
export const runtime = "nodejs";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

/** Browsers/OS sometimes omit type or use non-canonical MIME strings. */
function resolvedMime(file: File): string | null {
  let t = file.type.trim().toLowerCase();
  if (t === "image/jpg" || t === "image/pjpeg") {
    t = "image/jpeg";
  }
  if (t === "image/x-png") {
    t = "image/png";
  }
  if (t === "video/x-quicktime") {
    t = "video/quicktime";
  }
  if (IMAGE_TYPES.has(t) || VIDEO_TYPES.has(t)) {
    return t;
  }
  const ext = path.extname(file.name).toLowerCase();
  const byExt: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
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

const LOCAL_MULTIPART_MAX = 80 * 1024 * 1024;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    if (hasBlob) {
      return NextResponse.json(
        {
          error:
            "Blob is configured for this app — use direct-to-Blob uploads from the composer, not this endpoint. Refresh the dashboard and try again.",
        },
        { status: 400 },
      );
    }

    const onVercel = Boolean(process.env.VERCEL);
    if (onVercel) {
      return NextResponse.json(
        {
          error:
            "Add BLOB_READ_WRITE_TOKEN to this Vercel project and redeploy. Serverless cannot save files to disk here.",
        },
        { status: 503 },
      );
    }

    const maxBytes = LOCAL_MULTIPART_MAX;

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 });
    }

    const mime = resolvedMime(file);
    if (!mime) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Use JPEG, PNG, GIF, WebP, MP4, WebM, or MOV — or try another browser if the type was not detected.",
        },
        { status: 400 },
      );
    }

    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File too large (max ${Math.floor(maxBytes / (1024 * 1024))}MB).` },
        { status: 413 },
      );
    }

    const ext = extForMime(mime);
    if (!ext) {
      return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
    }

    try {
      const buf = Buffer.from(await file.arrayBuffer());
      const filename = `${randomUUID()}${ext}`;
      const dir = path.join(process.cwd(), "public", "uploads", "feed");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, filename), buf);

      const publicUrl = `/uploads/feed/${filename}`;
      return NextResponse.json({ url: publicUrl });
    } catch (e) {
      console.error("[upload-local] write", e);
      return NextResponse.json(
        {
          error:
            e instanceof Error
              ? `Could not save file: ${e.message}`
              : "Could not save file. Check that the app can write to public/uploads/feed.",
        },
        { status: 500 },
      );
    }
  } catch (e) {
    console.error("[upload-local]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload handler failed." },
      { status: 500 },
    );
  }
}
