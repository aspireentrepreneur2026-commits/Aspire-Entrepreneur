"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ToolkitTab = "ideas" | "business";

type HubEntry = {
  id: string;
  tab: ToolkitTab;
  icon: string;
  title: string;
  blurb: string;
  bullets: string[];
  cta: { label: string; hash: string } | { label: string; href: string };
  accent: {
    gradient: string;
    bar: string;
    iconBg: string;
  };
};

const hubs: HubEntry[] = [
  {
    id: "ideas-hub",
    tab: "ideas",
    icon: "💡",
    title: "Ideas & discovery",
    blurb:
      "Validate concepts, sketch MVPs, and get early feedback — start in the feed; hashtag-style tagging UX is on the roadmap.",
    bullets: ["Problem-first framing", "Customer interviews checklist", "Light competition scan"],
    cta: { label: "Start a feed post →", hash: "#feed-start" },
    accent: {
      gradient: "from-amber-50 to-orange-50/60",
      bar: "bg-gradient-to-b from-amber-400 to-orange-500",
      iconBg: "bg-amber-100 text-amber-900 ring-amber-200/80",
    },
  },
  {
    id: "learning-grow",
    tab: "ideas",
    icon: "📚",
    title: "Learning & playbook",
    blurb:
      "Curated entrepreneurship micro-lessons are coming soon — meanwhile, learn from the feed and structured profiles in your member network.",
    bullets: ["GTM teardowns • soon", "Legal & finance primer • soon", "Weekly founder AMA • soon"],
    cta: { label: "Open member network →", hash: "#network-members" },
    accent: {
      gradient: "from-rose-50 to-orange-50/30",
      bar: "bg-gradient-to-b from-rose-400 to-orange-500",
      iconBg: "bg-rose-100 text-rose-950 ring-rose-200/80",
    },
  },
  {
    id: "new-business-spotlight",
    tab: "business",
    icon: "🏪",
    title: "New businesses & SMEs",
    blurb:
      "Boutiques, agencies, franchises, and SMB launches — separate from VC-style startups. Share traction and hiring needs.",
    bullets: ["Local & digital reach", "Co-founder / partner search", "Supplier & channel intros"],
    cta: { label: "Share an update →", hash: "#feed-start" },
    accent: {
      gradient: "from-emerald-50 to-teal-50/50",
      bar: "bg-gradient-to-b from-emerald-400 to-teal-600",
      iconBg: "bg-emerald-100 text-emerald-950 ring-emerald-200/80",
    },
  },
  {
    id: "funding-desk",
    tab: "business",
    icon: "💰",
    title: "Funding & investors",
    blurb: "Warm intros, pitch prep, and deck feedback — full matching & data rooms are on the roadmap.",
    bullets: ["SAFE / bridge basics", "Investor update templates", "Cap table hygiene"],
    cta: { label: "Complete founder profile", href: "/onboarding" },
    accent: {
      gradient: "from-violet-50 to-fuchsia-50/40",
      bar: "bg-gradient-to-b from-violet-500 to-fuchsia-600",
      iconBg: "bg-violet-100 text-violet-950 ring-violet-200/80",
    },
  },
  {
    id: "mentorship-lab",
    tab: "business",
    icon: "🎓",
    title: "Mentorship & circles",
    blurb:
      "Office hours-style help from mentors — structured programs and peer groups arrive in a future release.",
    bullets: ["Mentor dashboards live", "Group sessions • soon", "Accountability buddies • soon"],
    cta: { label: "Browse member network →", hash: "#network-members" },
    accent: {
      gradient: "from-sky-50 to-blue-50/40",
      bar: "bg-gradient-to-b from-sky-400 to-[#0a66c2]",
      iconBg: "bg-sky-100 text-sky-950 ring-sky-200/80",
    },
  },
  {
    id: "startup-jobs",
    tab: "business",
    icon: "💼",
    title: "Startup jobs",
    blurb: "Announce roles for early teams — posting board, ATS sync, and apply-in-app flows are planned next.",
    bullets: ["Part-time / intern roles", "Equity-heavy roles", "Remote-friendly tags • soon"],
    cta: { label: "Announce hiring in the feed →", hash: "#feed-start" },
    accent: {
      gradient: "from-slate-50 to-indigo-50/45",
      bar: "bg-gradient-to-b from-indigo-400 to-slate-700",
      iconBg: "bg-indigo-100 text-indigo-950 ring-indigo-200/80",
    },
  },
];

const hashToCardId = Object.fromEntries(hubs.map((h) => [h.id, true])) as Record<string, boolean>;

function ToolkitCard({ h }: { h: HubEntry }) {
  return (
    <article
      id={h.id}
      className={`group relative scroll-mt-[6.5rem] overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br ${h.accent.gradient} p-[1px] shadow-sm transition hover:border-[#0a66c2]/25 hover:shadow-md`}
    >
      <div className="flex h-full flex-col rounded-[11px] bg-white/92 p-5 backdrop-blur-[2px] sm:p-6">
        <div className={`absolute left-0 top-0 hidden h-full w-1 rounded-l-xl sm:block ${h.accent.bar}`} aria-hidden />

        <div className="flex gap-4 pl-1 sm:pl-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl shadow-sm ring-1 ring-inset ${h.accent.iconBg}`}
            aria-hidden
          >
            {h.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[17px] font-semibold tracking-tight text-slate-900">{h.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{h.blurb}</p>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-600">
              {h.bullets.map((b) => (
                <li
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-50/90 px-2.5 py-1 ring-1 ring-slate-100"
                >
                  <span className="h-1 w-1 rounded-full bg-emerald-500" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex shrink-0 pl-1 sm:pl-3">
          {"href" in h.cta && h.cta.href ? (
            <Link
              href={h.cta.href}
              className="inline-flex items-center rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004182]"
            >
              {h.cta.label}
            </Link>
          ) : (
            <Link
              href={`/dashboard${(h.cta as { hash: string }).hash}`}
              className="inline-flex items-center rounded-full border border-[#0a66c2]/25 bg-[#e8f3fc]/70 px-4 py-2 text-sm font-semibold text-[#004182] transition hover:border-[#0a66c2]/45 hover:bg-[#e8f3fc]"
            >
              {h.cta.label}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function DashboardEntrepreneurHub() {
  const [tab, setTab] = useState<ToolkitTab>("ideas");

  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id || !hashToCardId[id]) return;
      const row = hubs.find((h) => h.id === id);
      if (row) setTab(row.tab);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const ideasHubs = hubs.filter((h) => h.tab === "ideas");
  const businessHubs = hubs.filter((h) => h.tab === "business");

  return (
    <section
      id="founder-toolkit"
      aria-labelledby="entrepreneur-hub-heading"
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-[#f8fafc] to-[#e8f3fc]/35 shadow-sm ring-1 ring-slate-100"
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#0a66c2]/5 blur-3xl" aria-hidden />
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="inline-block rounded-md bg-[#0a66c2] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              Founder & SME toolkit
            </p>
            <h2 id="entrepreneur-hub-heading" className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              Founder & business toolkit
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Split into <strong className="font-semibold text-slate-800">Ideas</strong> (validation & learning) and{" "}
              <strong className="font-semibold text-slate-800">Business</strong> (operations, capital, people, hiring) —
              all under your feed.
            </p>
          </div>
        </div>

        <div
          className="mt-6 flex flex-wrap gap-2 border-b border-slate-200/90 pb-px"
          role="tablist"
          aria-label="Toolkit categories"
        >
          <button
            type="button"
            role="tab"
            id="tab-ideas"
            aria-selected={tab === "ideas"}
            aria-controls="panel-ideas"
            className={`relative -mb-px rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
              tab === "ideas"
                ? "text-[#0a66c2] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-[#0a66c2]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
            onClick={() => setTab("ideas")}
          >
            Ideas
            <span className="ml-1.5 text-xs font-normal text-slate-400">({ideasHubs.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-business"
            aria-selected={tab === "business"}
            aria-controls="panel-business"
            className={`relative -mb-px rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
              tab === "business"
                ? "text-[#0a66c2] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-[#0a66c2]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
            onClick={() => setTab("business")}
          >
            Business
            <span className="ml-1.5 text-xs font-normal text-slate-400">({businessHubs.length})</span>
          </button>
        </div>

        <div className="mt-6 pt-1" tabIndex={-1}>
          {tab === "ideas" ? (
            <div id="panel-ideas" role="tabpanel" aria-labelledby="tab-ideas" className="flex flex-col gap-5">
              {ideasHubs.map((h) => (
                <ToolkitCard key={h.id} h={h} />
              ))}
            </div>
          ) : (
            <div id="panel-business" role="tabpanel" aria-labelledby="tab-business" className="flex flex-col gap-5">
              {businessHubs.map((h) => (
                <ToolkitCard key={h.id} h={h} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
