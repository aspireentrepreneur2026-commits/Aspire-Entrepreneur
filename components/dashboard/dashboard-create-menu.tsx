"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const items = [
  {
    key: "post",
    label: "Post to feed",
    sub: "Update, milestone, question",
    emoji: "✍️",
    href: "#feed-start",
    soon: false,
  },
  {
    key: "idea",
    label: "Idea spotlight",
    sub: "Share a problem / concept",
    emoji: "💡",
    href: "#ideas-hub",
    soon: false,
  },
  {
    key: "business",
    label: "New business story",
    sub: "Launch, SMB, side project",
    emoji: "🚀",
    href: "#new-business-spotlight",
    soon: false,
  },
  {
    key: "poll",
    label: "Community poll",
    sub: "Validate with votes",
    emoji: "📊",
    href: "",
    soon: true,
  },
  {
    key: "event",
    label: "Event or meetup",
    sub: "Pitch nights, webinars",
    emoji: "📅",
    href: "",
    soon: true,
  },
  {
    key: "startup",
    label: "Startup listing",
    sub: "Showcase your startup",
    emoji: "💼",
    href: "#startups",
    soon: false,
  },
  {
    key: "article",
    label: "Long-form article",
    sub: "Playbook / lessons learned",
    emoji: "📝",
    href: "",
    soon: true,
  },
  {
    key: "reel",
    label: "Short video (Reels-style)",
    sub: "30s pitch teaser",
    emoji: "🎬",
    href: "",
    soon: true,
  },
  {
    key: "product",
    label: "Product or service spotlight",
    sub: "What you ship — founders & SMEs",
    emoji: "🛍️",
    href: "",
    soon: true,
  },
  {
    key: "fundraiser",
    label: "Raise / campaign update",
    sub: "Round, grant, crowdfunding note",
    emoji: "🎯",
    href: "#funding-desk",
    soon: false,
  },
  {
    key: "group",
    label: "Founder circle or group post",
    sub: "Private rooms • coming",
    emoji: "👯",
    href: "",
    soon: true,
  },
  {
    key: "story",
    label: "24h story clip",
    sub: "Like Stories — fleeting updates",
    emoji: "📸",
    href: "",
    soon: true,
  },
  {
    key: "guide",
    label: "Resource or template",
    sub: "Checklist, one-pager, link pack",
    emoji: "🔗",
    href: "#learning-grow",
    soon: false,
  },
] as const;

export function DashboardCreateMenu({ workspaceHref }: { workspaceHref: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  const afterNavigate = (key: string, hash: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      const target = document.querySelector(hash);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (key === "post") {
        setTimeout(() => {
          (document.querySelector(`${hash} textarea[name="body"]`) as HTMLTextAreaElement | null)?.focus();
        }, 380);
      }
    });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hidden items-center gap-1 rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#004182] sm:flex"
        aria-expanded={open}
      >
        <span>Create</span>
        <span className="text-xs opacity-90" aria-hidden>
          ▼
        </span>
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,20rem)] overflow-hidden rounded-xl border border-slate-200 bg-white py-2 text-sm shadow-xl sm:left-0 sm:right-auto">
          <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Aspire — create
          </div>
          <ul className="max-h-[min(70vh,22rem)] overflow-y-auto py-1">
            {items.map((it) => (
              <li key={it.key}>
                {it.soon ? (
                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-start gap-3 px-4 py-2.5 text-left text-slate-400"
                  >
                    <span className="text-lg leading-none">{it.emoji}</span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2 font-semibold">
                        {it.label}
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">Soon</span>
                      </span>
                      <span className="block text-xs text-slate-400">{it.sub}</span>
                    </span>
                  </button>
                ) : (
                  <Link
                    href={`/dashboard${it.href}`}
                    className="flex items-start gap-3 px-4 py-2.5 text-slate-800 hover:bg-slate-50"
                    onClick={() => afterNavigate(it.key, it.href)}
                  >
                    <span className="text-lg leading-none">{it.emoji}</span>
                    <span>
                      <span className="block font-semibold">{it.label}</span>
                      <span className="block text-xs text-slate-500">{it.sub}</span>
                    </span>
                  </Link>
                )}
              </li>
            ))}
            <li className="border-t border-slate-100 px-4 py-2">
              <Link
                href={workspaceHref}
                className="text-xs font-semibold text-[#0a66c2] hover:underline"
                onClick={() => setOpen(false)}
              >
                Workspace dashboard →
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
