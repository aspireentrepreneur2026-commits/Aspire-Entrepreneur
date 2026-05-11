"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/** Only working routes — no placeholders or “soon” items. */
type StoryShortcut = {
  emoji: string;
  label: string;
  caption: string;
  href: string;
  ring: string;
  /** When set, full link is `href` + `hash` (e.g. scroll target on dashboard). */
  hash?: string;
};

const shortcuts: StoryShortcut[] = [
  { emoji: "✨", label: "Tip", caption: "Onboarding", href: "/onboarding", ring: "from-violet-500 to-fuchsia-600" },
  { emoji: "💡", label: "Ideas", caption: "Workspace", href: "/dashboard/ideas", ring: "from-amber-400 to-orange-600" },
  { emoji: "🔍", label: "Discover", caption: "Search", href: "/dashboard/discover", ring: "from-emerald-500 to-teal-600" },
  { emoji: "👥", label: "Network", caption: "Members", href: "/dashboard/network", ring: "from-sky-500 to-blue-700" },
  {
    emoji: "📣",
    label: "Feed",
    caption: "Community",
    href: "/dashboard",
    ring: "from-rose-500 to-red-600",
    hash: "#feed-start",
  },
];

const ringOuter = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-[2px] shadow-sm";
const ringInner = "flex h-full w-full items-center justify-center rounded-full bg-white text-[15px] leading-none";

export function DashboardStoriesStrip({ userInitial }: { userInitial: string }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/90 bg-white px-3 py-3 shadow-sm sm:px-4">
      <div className="flex gap-3 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          aria-label="Compose a post on the home feed"
          onClick={() => {
            router.push("/dashboard#feed-start");
            setTimeout(() => {
              document.querySelector("#feed-start")?.scrollIntoView({ behavior: "smooth", block: "start" });
              setTimeout(() => {
                (document.querySelector("#feed-start textarea[name='body']") as HTMLTextAreaElement | null)?.focus();
              }, 280);
            }, 80);
          }}
          className="flex shrink-0 flex-col items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a66c2]"
        >
          <span
            className={`${ringOuter} bg-gradient-to-br from-[#0a66c2] to-[#004182]`}
            aria-hidden
          >
            <span className={`${ringInner} shadow-inner`}>
              <span className="text-sm font-bold text-[#0a66c2]">{userInitial}</span>
            </span>
          </span>
          <span className="max-w-[4rem] truncate text-center text-[10px] font-semibold leading-tight text-slate-800">
            Post
          </span>
          <span className="max-w-[4rem] truncate text-center text-[9px] leading-tight text-slate-500">To feed</span>
        </button>

        {shortcuts.map((s) =>
          s.hash ? (
            <Link
              key={s.href + s.hash}
              href={`${s.href}${s.hash}`}
              className="flex shrink-0 flex-col items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a66c2]"
            >
              <span className={`${ringOuter} bg-gradient-to-br ${s.ring}`} aria-hidden>
                <span className={ringInner}>{s.emoji}</span>
              </span>
              <span className="max-w-[4rem] truncate text-center text-[10px] font-semibold leading-tight text-slate-800">
                {s.label}
              </span>
              <span className="max-w-[4rem] truncate text-center text-[9px] leading-tight text-slate-500">{s.caption}</span>
            </Link>
          ) : (
            <Link
              key={s.href}
              href={s.href}
              className="flex shrink-0 flex-col items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a66c2]"
            >
              <span className={`${ringOuter} bg-gradient-to-br ${s.ring}`} aria-hidden>
                <span className={ringInner}>{s.emoji}</span>
              </span>
              <span className="max-w-[4rem] truncate text-center text-[10px] font-semibold leading-tight text-slate-800">
                {s.label}
              </span>
              <span className="max-w-[4rem] truncate text-center text-[9px] leading-tight text-slate-500">{s.caption}</span>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
