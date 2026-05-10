"use client";

function youtubeEmbedId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1) || null;
    }
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/watch")) {
        return u.searchParams.get("v");
      }
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/")[2] ?? null;
      }
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/")[2] ?? null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function MediaBlock({ url, kind }: { url: string; kind: "IMAGE" | "VIDEO" | "LINK" }) {
  if (kind === "IMAGE") {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote user URLs */}
        <img src={url} alt="" className="max-h-96 w-full object-contain" loading="lazy" />
      </a>
    );
  }

  if (kind === "VIDEO") {
    const yt = youtubeEmbedId(url);
    if (yt) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-black">
          <iframe
            title="Embedded video"
            src={`https://www.youtube-nocookie.com/embed/${yt}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <video controls className="max-h-96 w-full rounded-xl border border-slate-200 bg-black" preload="metadata">
        <source src={url} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-100"
    >
      <span className="truncate">{url}</span>
    </a>
  );
}
