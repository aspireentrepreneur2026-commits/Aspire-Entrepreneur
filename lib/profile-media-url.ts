/** Profile/cover images: HTTPS or our uploaded paths (feed or profile folders). */
export function isAllowedProfileImageUrl(raw: string): boolean {
  const s = raw.trim();
  if (!s || s.includes("..")) return false;
  if (/^\/uploads\/(feed|profile)\/[^/]+$/.test(s)) return true;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}
