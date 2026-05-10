import { NextResponse } from "next/server";

/** Avoid CDN caching Blob vs multipart — must match runtime env vars. */
export const dynamic = "force-dynamic";

/**
 * Client upload behaviour:
 * - `blob`: device files go through @vercel/blob (large files OK when token is set).
 * - `multipart`: device files POST to /api/feed/upload-local (dev / self-hosted disk).
 * - `disabled`: production on Vercel without Blob — disk upload is impossible; suggest env var.
 */
export async function GET() {
  const blob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const onVercel = Boolean(process.env.VERCEL);

  /** Bump when behaviour changes — if missing in production JSON, deployment is stale. */
  const v = { schemaVersion: 2 as const };

  if (blob) {
    return NextResponse.json({
      ...v,
      blob: true,
      mode: "blob" as const,
      multipartMaxMb: 500,
      deviceUploadsEnabled: true,
      hint: "Direct uploads use Vercel Blob — much larger files than the old 4MB server limit.",
    });
  }

  if (onVercel) {
    return NextResponse.json({
      ...v,
      blob: false,
      mode: "disabled" as const,
      multipartMaxMb: 0,
      deviceUploadsEnabled: false,
      disabledReason:
        "To upload photos/videos from this device: add Environment Variable BLOB_READ_WRITE_TOKEN to this exact Vercel project (Production), ensure your Blob store is connected to this project, then trigger a Redeploy. Paste image/video URLs still work without Blob.",
    });
  }

  return NextResponse.json({
    ...v,
    blob: false,
    mode: "multipart" as const,
    multipartMaxMb: 80,
    deviceUploadsEnabled: true,
    hint: "Files are saved under public/uploads/feed (up to ~80MB per file locally).",
  });
}
