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
        className="text-xs font-medium text-red-600 underline-offset-2 hover:underline disabled:opacity-50"
      >
        {pending ? "Removing…" : "Delete post"}
      </button>
      {state?.error ? <span className="ml-2 text-xs text-red-600">{state.error}</span> : null}
    </form>
  );
}
