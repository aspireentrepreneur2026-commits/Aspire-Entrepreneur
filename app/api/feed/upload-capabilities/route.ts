import { NextResponse } from "next/server";

/**
 * Lets the composer choose client Blob upload vs multipart local upload.
 * Vercel body limit ~4.5MB for multipart; Blob client upload supports larger files when token exists.
 */
export async function GET() {
  const blob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const onVercel = Boolean(process.env.VERCEL);
  return NextResponse.json({
    blob,
    /** Multipart max size (MB) when not using Blob client upload. */
    multipartMaxMb: onVercel ? 4 : 80,
    mode: blob ? ("blob" as const) : ("multipart" as const),
  });
}
