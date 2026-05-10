"use client";

import { useActionState } from "react";
import { deleteFeedPost, type FeedActionState } from "@/app/actions/feed";

const initial: FeedActionState | undefined = undefined;

export function FeedDeleteButton({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState(deleteFeedPost, initial);

  return (
    <form action={action} className="inline">
      <input type="hidden" name="postId" value={postId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "…" : "Delete"}
      </button>
      {state?.error ? <span className="ml-2 text-xs text-red-600">{state.error}</span> : null}
    </form>
  );
}
