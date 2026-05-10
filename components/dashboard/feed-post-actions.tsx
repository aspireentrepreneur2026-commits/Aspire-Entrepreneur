"use client";

import { useCallback, useMemo, useState } from "react";

type Props = {
  postId: string;
  commentInputId: string;
};

export function FeedPostActions({ postId, commentInputId }: Props) {
  const [liked, setLiked] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/dashboard#post-${postId}`;
  }, [postId]);

  const focusComment = useCallback(() => {
    const el = document.getElementById(commentInputId);
    if (el && "focus" in el) {
      (el as HTMLInputElement).focus();
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [commentInputId]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl || window.location.href);
      setToast("Link copied");
      setTimeout(() => setToast(null), 2000);
    } catch {
      setToast("Could not copy link");
      setTimeout(() => setToast(null), 2000);
    }
  }, [shareUrl]);

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-1 border-t border-slate-100 pt-1">
        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          title="Reactions coming soon — visual preview"
          className={`flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold transition hover:bg-slate-50 ${
            liked ? "text-[#0a66c2]" : "text-slate-600"
          }`}
        >
          <span className="text-base" aria-hidden>
            {liked ? "✓" : "👍"}
          </span>
          {liked ? "Liked" : "Like"}
        </button>
        <button
          type="button"
          onClick={focusComment}
          className="flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <span className="text-base" aria-hidden>
            💬
          </span>
          Comment
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <span className="text-base" aria-hidden>
            ↗
          </span>
          Share
        </button>
        <button
          type="button"
          disabled
          title="Coming soon"
          className="hidden cursor-not-allowed items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold text-slate-400 sm:flex sm:flex-1 disabled:opacity-60"
        >
          <span className="text-base" aria-hidden>
            📤
          </span>
          Repost <span className="text-[10px] font-normal">(soon)</span>
        </button>
      </div>
      {toast ? (
        <p className="pointer-events-none absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs text-white shadow-lg">
          {toast}
        </p>
      ) : null}
    </div>
  );
}
