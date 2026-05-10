"use client";

import { useActionState } from "react";
import { createFeedPost, type FeedActionState } from "@/app/actions/feed";

const initial: FeedActionState | undefined = undefined;

export function FeedComposer() {
  const [state, action, pending] = useActionState(createFeedPost, initial);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
      <div>
        <p className="text-sm font-semibold text-slate-900">Create a post</p>
        <p className="mt-1 text-xs text-slate-500">
          Text supports links and emojis. Add optional media URLs (one per line) — we detect images, videos, and links.
        </p>
      </div>

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-700">{state.success}</p> : null}

      <textarea
        name="body"
        required
        rows={4}
        maxLength={8000}
        placeholder="Share an update, idea, milestone, or ask the community… 😊"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none ring-indigo-500/0 transition focus:border-indigo-400 focus:bg-white focus:ring-2"
      />

      <div className="space-y-1">
        <label htmlFor="feed-urls" className="text-xs font-medium text-slate-600">
          Images, videos & links (optional)
        </label>
        <textarea
          id="feed-urls"
          name="urls"
          rows={3}
          maxLength={4000}
          placeholder={"https://example.com/image.png\nhttps://www.youtube.com/watch?v=…\nhttps://your-startup.com"}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-xs text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Publishing…" : "Publish to feed"}
      </button>
    </form>
  );
}
