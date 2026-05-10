import type { FeedAttachmentKind } from "@prisma/client";

/** Allow https URLs plus our locally stored feed uploads. */
export function isAllowedFeedMediaUrl(raw: string): boolean {
  const s = raw.trim();
  if (/^\/uploads\/feed\/[a-zA-Z0-9._-]+$/.test(s)) return true;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Align with server/storage: infer IMAGE / VIDEO / LINK from URL path and known hosts. */
export function inferFeedAttachmentKind(url: string): FeedAttachmentKind {
  const lower = url.toLowerCase();

  if (
    /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|#|$)/i.test(lower) ||
    /\.(jpg|jpeg|png|gif|webp)(\?|#|$)/i.test(lower.split("?")[0].replace(/https?:\/\/[^/]+/i, ""))
  ) {
    return "IMAGE";
  }

  if (
    /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(lower) ||
    /youtube\.com|youtu\.be|vimeo\.com|loom\.com/.test(lower)
  ) {
    return "VIDEO";
  }

  return "LINK";
}
