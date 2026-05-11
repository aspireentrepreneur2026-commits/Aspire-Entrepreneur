"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { followUserAction, unfollowUserAction, type ProfileActionState } from "@/app/actions/profile";

export function FollowButton({
  targetUserId,
  initialFollowing,
  canFollow,
}: {
  targetUserId: string;
  initialFollowing: boolean;
  canFollow: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<ProfileActionState>) => {
    setMsg(null);
    startTransition(async () => {
      const res = await fn();
      if (res.error) {
        setMsg(res.error);
        return;
      }
      setFollowing((f) => !f);
      router.refresh();
    });
  };

  if (!canFollow) {
    return (
      <button
        type="button"
        disabled
        title="Follow is available when this member’s profile is approved."
        className="shrink-0 cursor-not-allowed rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-400"
      >
        Follow
      </button>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      {following ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => unfollowUserAction(targetUserId))}
          className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-60"
        >
          {pending ? "…" : "Following"}
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => followUserAction(targetUserId))}
          className="rounded-full bg-[#0a66c2] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#004182] disabled:opacity-60"
        >
          {pending ? "…" : "Follow"}
        </button>
      )}
      {msg ? <p className="max-w-[14rem] text-right text-xs text-red-600">{msg}</p> : null}
    </div>
  );
}
