"use client";

import { useActionState } from "react";
import { createFeedComment, type FeedActionState } from "@/app/actions/feed";

const initial: FeedActionState | undefined = undefined;

export function FeedCommentForm({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState(createFeedComment, initial);
  const inputId = `comment-input-${postId}`;

  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <input type="hidden" name="postId" value={postId} />
      <input
        id={inputId}
        name="body"
        type="text"
        required
        maxLength={2000}
        placeholder="Write a comment…"
        autoComplete="off"
        className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0a66c2] focus:bg-white focus:ring-2 focus:ring-[#0a66c2]/20"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "…" : "Comment"}
      </button>
      {state?.error ? <p className="w-full text-xs text-red-600">{state.error}</p> : null}
    </form>
  );
}
