"use client";

import { useState } from "react";
import { publicUserMediaUrl } from "@/lib/profile-media-url";

/** Avatar with normalized URL and fallback to initial if load fails or URL is empty. */
export function ProfileAvatarImg({
  url,
  initial,
  imgClassName,
  fallbackClassName,
}: {
  url: string | null | undefined;
  initial: string;
  imgClassName: string;
  fallbackClassName: string;
}) {
  const [broken, setBroken] = useState(false);
  const src = publicUserMediaUrl(url);
  if (!src || broken) {
    return <span className={fallbackClassName}>{initial}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- user-provided URL; onError fallback
    <img src={src} alt="" className={imgClassName} onError={() => setBroken(true)} />
  );
}

/** Cover banner: normalized URL; returns null if missing or failed to load. */
export function ProfileCoverImg({
  url,
  className,
}: {
  url: string | null | undefined;
  className: string;
}) {
  const [broken, setBroken] = useState(false);
  const src = publicUserMediaUrl(url);
  if (!src || broken) {
    return null;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} onError={() => setBroken(true)} />
  );
}
