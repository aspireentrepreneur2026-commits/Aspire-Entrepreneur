/**
 * Normalizes stored avatar/cover URLs for <img src> (fixes missing leading slash,
 * protocol-relative URLs, and stray backslashes from Windows paths).
 */
export function publicUserMediaUrl(raw: string | null | undefined): string | undefined {
  if (raw == null) return undefined;
  let s = raw.trim().replace(/\\/g, "/");
  if (!s) return undefined;
  if (s.startsWith("//")) {
    return `https:${s}`;
  }
  if (/^https?:\/\//i.test(s)) {
    return s;
  }
  if (s.startsWith("/")) {
    return s;
  }
  return `/${s.replace(/^\/+/, "")}`;
}

/** Profile/cover images: HTTPS or our uploaded paths (feed or profile folders). */
export function isAllowedProfileImageUrl(raw: string): boolean {
  const s = publicUserMediaUrl(raw) ?? raw.trim();
  if (!s || s.includes("..")) return false;
  if (/^\/uploads\/(feed|profile)\/[^/]+$/.test(s)) return true;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}
