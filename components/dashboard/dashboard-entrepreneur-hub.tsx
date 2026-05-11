"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IDEAS_HUB_ENTRIES,
  IDEAS_HUB_IDS,
  STARTUPS_TOOLKIT_IDS,
} from "@/components/dashboard/entrepreneur-hub-data";
import { HubToolkitCard } from "@/components/dashboard/hub-toolkit-card";

type ToolkitTab = "ideas" | "discover";

export function DashboardEntrepreneurHub() {
  const router = useRouter();
  const [tab, setTab] = useState<ToolkitTab>("ideas");

  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (STARTUPS_TOOLKIT_IDS[id]) {
        router.replace(`/dashboard/startups#${id}`);
        return;
      }
      if (!id || !IDEAS_HUB_IDS[id]) return;
      setTab("ideas");
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [router]);

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
              Ideas &amp; discover hub
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              <strong className="font-semibold text-slate-800">Ideas</strong> stay below for quick access.{" "}
              <strong className="font-semibold text-slate-800">Discover</strong> is your LinkedIn-style entry to search
              people, startups, mentors, and more — full workspace on{" "}
              <Link href="/dashboard/discover" className="font-semibold text-[#0a66c2] hover:underline">
                /dashboard/discover
              </Link>
              . Startups &amp; funding cards moved to{" "}
              <Link href="/dashboard/startups" className="font-semibold text-[#0a66c2] hover:underline">
                Startups workspace
              </Link>
              .
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
            <span className="ml-1.5 text-xs font-normal text-slate-400">({IDEAS_HUB_ENTRIES.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-discover"
            aria-selected={tab === "discover"}
            aria-controls="panel-discover"
            className={`relative -mb-px rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
              tab === "discover"
                ? "text-[#0a66c2] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-[#0a66c2]"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
            onClick={() => setTab("discover")}
          >
            Discover
          </button>
        </div>

        <div className="mt-6 pt-1" tabIndex={-1}>
          {tab === "ideas" ? (
            <div id="panel-ideas" role="tabpanel" aria-labelledby="tab-ideas" className="flex flex-col gap-5">
              <p className="text-sm text-slate-600">
                Want the full-page view?{" "}
                <Link href="/dashboard/ideas" className="font-semibold text-[#0a66c2] hover:underline">
                  Open ideas workspace →
                </Link>
              </p>
              {IDEAS_HUB_ENTRIES.map((h) => (
                <HubToolkitCard key={h.id} h={h} dashboardBase="/dashboard" />
              ))}
            </div>
          ) : (
            <div id="panel-discover" role="tabpanel" aria-labelledby="tab-discover" className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-lg font-semibold text-slate-900">Search &amp; filters (preview)</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Keyword search, entity type (people, founders, mentors, investors, startups, ideas), location, stage,
                  industry, school, company, and saved searches — same mental model as LinkedIn, tuned for Aspire.
                </p>
                <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600" aria-hidden>
                      ✓
                    </span>
                    Live member search (name, email, phone, goals, startups, investors…)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-600" aria-hidden>
                      ✓
                    </span>
                    URL filters you can bookmark or share
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600" aria-hidden>
                      ○
                    </span>
                    Saved searches &amp; email alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-600" aria-hidden>
                      ○
                    </span>
                    Search feed posts &amp; ideas content
                  </li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/discover"
                    className="inline-flex rounded-full bg-[#0a66c2] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#004182]"
                  >
                    Open discover →
                  </Link>
                  <Link
                    href="/dashboard#network-members"
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    Member network
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
