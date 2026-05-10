"use client";

import { feedAuthorSubtitle } from "@/lib/feed-display-name";
import { FeedCommentForm } from "@/components/feed/feed-comment-form";
import { FeedDeleteButton } from "@/components/feed/feed-delete-button";
import { LinkifiedText } from "@/components/feed/linkified-text";
import { MediaBlock } from "@/components/feed/media-block";
import type { FeedPostView } from "@/components/feed/feed-types";

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

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900">{post.author.name}</p>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-indigo-700">
              {roleLabel[post.author.role] ?? post.author.role}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-indigo-700">{authorLine}</p>
          <p className="mt-1 text-xs text-slate-500">
            {new Date(post.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        {canDelete ? <FeedDeleteButton postId={post.id} /> : null}
      </header>

      <div className="mt-4 text-sm leading-relaxed text-slate-800">
        <LinkifiedText text={post.body} />
      </div>

      {post.attachments.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3">
          {post.attachments.map((a) => (
            <MediaBlock key={a.id} url={a.url} kind={a.kind} />
          ))}
        </div>
      ) : null}

      <section className="mt-6 border-t border-slate-100 pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Comments ({post.comments.length})
        </p>
        <ul className="mb-4 space-y-3">
          {post.comments.map((c) => (
            <li key={c.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium text-slate-900">{c.author.name}</span>
                <span className="text-xs text-indigo-700">{feedAuthorSubtitle(c.author)}</span>
                <span className="text-xs text-slate-400">
                  {new Date(c.createdAt).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <div className="mt-1 text-slate-700">
                <LinkifiedText text={c.body} />
              </div>
            </li>
          ))}
        </ul>
        <FeedCommentForm postId={post.id} />
      </section>
    </article>
  );
}
