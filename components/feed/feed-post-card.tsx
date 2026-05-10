"use client";

import { feedAuthorSubtitle } from "@/lib/feed-display-name";
import { FeedCommentForm } from "@/components/feed/feed-comment-form";
import { FeedDeleteButton } from "@/components/feed/feed-delete-button";
import { LinkifiedText } from "@/components/feed/linkified-text";
import { MediaBlock } from "@/components/feed/media-block";
import type { FeedPostView } from "@/components/feed/feed-types";
import { FeedPostActions } from "@/components/dashboard/feed-post-actions";

const roleLabel: Record<string, string> = {
  FOUNDER: "Founder",
  MENTOR: "Mentor",
  INVESTOR: "Investor",
  ADMIN: "Admin",
};

export function FeedPostCard({
  post,
  currentUserId,
  isAdmin,
}: {
  post: FeedPostView;
  currentUserId: string;
  isAdmin: boolean;
}) {
  const authorLine = feedAuthorSubtitle(post.author);
  const canDelete = post.author.id === currentUserId || isAdmin;
  const initial = post.author.name.trim().charAt(0).toUpperCase() || "?";
  const commentInputId = `comment-input-${post.id}`;
  const timeLabel = new Date(post.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article
      id={`post-${post.id}`}
      className="relative scroll-mt-28 rounded-lg border border-slate-200/90 bg-white shadow-sm"
    >
      <header className="flex gap-3 p-4 pb-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-lg font-semibold text-white shadow-inner">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[15px] font-semibold leading-tight text-slate-900">{post.author.name}</p>
              <p className="mt-0.5 truncate text-sm text-slate-600">{authorLine}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{timeLabel}</span>
                <span className="text-slate-300">·</span>
                <span className="rounded-sm bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                  {roleLabel[post.author.role] ?? post.author.role}
                </span>
                <span className="hidden text-slate-400 sm:inline">· Public to members</span>
              </p>
            </div>
            <div className="flex shrink-0 items-start gap-1">
              {canDelete ? <FeedDeleteButton postId={post.id} /> : null}
              <button
                type="button"
                disabled
                title="More actions — coming soon"
                className="rounded p-2 text-xl leading-none text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed"
                aria-hidden
              >
                ···
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 pb-3 text-[15px] leading-relaxed text-slate-900">
        <LinkifiedText text={post.body} />
      </div>

      {post.attachments.length > 0 ? (
        <div className="border-t border-slate-100 px-2 pb-2 pt-2">
          <div className="flex flex-col gap-2">
            {post.attachments.map((a) => (
              <MediaBlock key={a.id} url={a.url} kind={a.kind} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="border-t border-slate-100 px-4 py-1">
        <FeedPostActions postId={post.id} commentInputId={commentInputId} />
      </div>

      <section className="border-t border-slate-100 bg-slate-50/60 px-4 py-4">
        <p className="mb-3 text-xs font-semibold text-slate-500">
          {post.comments.length === 0
            ? "Be the first to comment"
            : `${post.comments.length} comment${post.comments.length === 1 ? "" : "s"}`}
        </p>
        <ul className="mb-4 space-y-3">
          {post.comments.map((c) => {
            const ci = c.author.name.trim().charAt(0).toUpperCase() || "?";
            return (
              <li key={c.id} className="flex gap-2">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  {ci}
                </div>
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-semibold text-slate-900">{c.author.name}</span>
                    <span className="text-xs text-slate-500">{feedAuthorSubtitle(c.author)}</span>
                  </div>
                  <div className="mt-0.5 text-sm text-slate-800">
                    <LinkifiedText text={c.body} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {new Date(c.createdAt).toLocaleString(undefined, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <FeedCommentForm postId={post.id} />
      </section>
    </article>
  );
}
