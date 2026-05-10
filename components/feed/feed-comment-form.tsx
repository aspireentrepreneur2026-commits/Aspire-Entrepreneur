"use client";

import { useActionState } from "react";
import { createFeedComment, type FeedActionState } from "@/app/actions/feed";

const initial: FeedActionState | undefined = undefined;

export function FeedCommentForm({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState(createFeedComment, initial);

  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <input type="hidden" name="postId" value={postId} />
      <input
        name="body"
        type="text"
        required
        maxLength={2000}
        placeholder="Write a comment…"
        className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
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
