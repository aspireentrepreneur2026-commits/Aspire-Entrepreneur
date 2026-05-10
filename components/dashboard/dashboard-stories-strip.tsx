"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const stories = [
  { emoji: "✨", label: "Tip", caption: "Onboarding", href: "/onboarding", ring: "from-violet-500 to-fuchsia-600" },
  { emoji: "💡", label: "Ideas", caption: "Idea hub", href: "/dashboard", hash: "#ideas-hub", ring: "from-amber-400 to-orange-600" },
  { emoji: "🏪", label: "Business", caption: "New ventures", href: "/dashboard", hash: "#new-business-spotlight", ring: "from-emerald-500 to-teal-600" },
  { emoji: "🎯", label: "Mentors", caption: "Experts", href: "/dashboard", hash: "#network-members", ring: "from-sky-500 to-blue-700" },
  { emoji: "📣", label: "Feed", caption: "Community", href: "/dashboard", hash: "#feed-start", ring: "from-rose-500 to-red-600" },
  {
    emoji: "🎥",
    label: "Live",
    caption: "Soon",
    href: "",
    soon: true,
    ring: "from-slate-400 to-slate-600",
  },
];

export function DashboardStoriesStrip({ userInitial }: { userInitial: string }) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm">
      <div className="flex gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <StoryRing
          label="You"
          caption="Your story"
          ring="from-[#0a66c2] to-[#004182]"
          onClick={() => {
            router.push("/dashboard#feed-start");
            setTimeout(() => {
              document.querySelector("#feed-start")?.scrollIntoView({ behavior: "smooth", block: "start" });
              setTimeout(() => {
                (document.querySelector("#feed-start textarea[name='body']") as HTMLTextAreaElement | null)?.focus();
              }, 280);
            }, 80);
          }}
        >
          <span className="text-lg font-bold text-[#0a66c2]">{userInitial}</span>
        </StoryRing>

        {stories.map((s, i) =>
          s.soon ? (
            <button
              key={i}
              type="button"
              disabled
              title="Stories & live rooms — coming soon"
              className="flex shrink-0 flex-col items-center opacity-55"
            >
              <span className="flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-slate-200 p-[3px]">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-white text-xl">
                  {s.emoji}
                </span>
              </span>
              <span className="mt-1.5 max-w-[4.5rem] truncate text-center text-[11px] font-semibold text-slate-500">
                {s.label}
              </span>
              <span className="max-w-[4.5rem] truncate text-center text-[10px] text-slate-400">{s.caption}</span>
            </button>
          ) : s.href && s.hash ? (
            <Link key={i} href={`${s.href}${s.hash}`} className="flex shrink-0 flex-col items-center">
              <span
                className={`flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-gradient-to-br ${s.ring} p-[3px] shadow-md`}
              >
                <span className="flex h-full w-full items-center justify-center rounded-full bg-white text-xl">
                  {s.emoji}
                </span>
              </span>
              <span className="mt-1.5 max-w-[4.5rem] truncate text-center text-[11px] font-semibold text-slate-800">
                {s.label}
              </span>
              <span className="max-w-[4.5rem] truncate text-center text-[10px] text-slate-500">{s.caption}</span>
            </Link>
          ) : (
            <Link key={i} href={s.href || "/dashboard"} className="flex shrink-0 flex-col items-center">
              <span
                className={`flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-gradient-to-br ${s.ring} p-[3px] shadow-md`}
              >
                <span className="flex h-full w-full items-center justify-center rounded-full bg-white text-xl">
                  {s.emoji}
                </span>
              </span>
              <span className="mt-1.5 max-w-[4.5rem] truncate text-center text-[11px] font-semibold text-slate-800">
                {s.label}
              </span>
              <span className="max-w-[4.5rem] truncate text-center text-[10px] text-slate-500">{s.caption}</span>
            </Link>
          ),
        )}
      </div>
      <p className="mt-3 border-t border-slate-100 pt-2 text-center text-[10px] text-slate-400">
        Shortcuts like Instagram Stories — uploads & live pitches coming soon.
      </p>
    </div>
  );
}

function StoryRing({
  children,
  label,
  caption,
  ring,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  caption: string;
  ring: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 flex-col items-center">
      <span className={`flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-gradient-to-br ${ring} p-[3px] shadow-md`}>
        <span className="flex h-full w-full items-center justify-center rounded-full bg-white shadow-inner">
          {children}
        </span>
      </span>
      <span className="mt-1.5 max-w-[4.5rem] truncate text-center text-[11px] font-semibold text-slate-800">{label}</span>
      <span className="max-w-[4.5rem] truncate text-center text-[10px] text-slate-500">{caption}</span>
    </button>
  );
}
