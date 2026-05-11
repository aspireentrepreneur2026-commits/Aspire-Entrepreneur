import Link from "next/link";
import { FOUNDER_SME_TOOLKIT_ENTRIES, IDEAS_HUB_ENTRIES } from "@/components/dashboard/entrepreneur-hub-data";
import { HubToolkitCard } from "@/components/dashboard/hub-toolkit-card";
import { requireAuth } from "@/lib/session";

export default async function IdeasWorkspacePage() {
  await requireAuth();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 sm:px-6">
      <Link href="/dashboard" className="text-sm font-medium text-[#0a66c2] hover:underline">
        ← Back to home feed
      </Link>

      <header className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0a66c2]">Ideas workspace</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Ideas &amp; learning</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Validation, discovery, and playbooks — plus the <strong className="font-semibold text-slate-800">Founder &amp; SME toolkit</strong>{" "}
          for funding, mentorship, and business growth. Use <Link href="/dashboard/discover" className="font-semibold text-[#0a66c2] hover:underline">Discover</Link>{" "}
          for LinkedIn-style search.
        </p>
      </header>

      <section id="founder-sme-toolkit" className="scroll-mt-28 mt-12" aria-labelledby="founder-sme-toolkit-heading">
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-[#f8fafc] to-[#e8f3fc]/35 p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
          <p className="inline-block rounded-md bg-[#0a66c2] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            Founder &amp; SME toolkit
          </p>
          <h2 id="founder-sme-toolkit-heading" className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
            Growth, funding &amp; mentorship
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Cards for new businesses, funding desk, mentorship lab, and business spotlight — same resources as before,
            now grouped here with ideas content.
          </p>
          <div className="mt-8 flex flex-col gap-5">
            {FOUNDER_SME_TOOLKIT_ENTRIES.map((h) => (
              <HubToolkitCard key={h.id} h={h} dashboardBase="/dashboard" />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14" aria-labelledby="ideas-cards-heading">
        <h2 id="ideas-cards-heading" className="text-lg font-semibold text-slate-900">
          Ideas &amp; validation
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Member network lives on{" "}
          <Link href="/dashboard/network" className="font-semibold text-[#0a66c2] hover:underline">
            /dashboard/network
          </Link>
          .
        </p>
        <div className="mt-6 flex flex-col gap-5">
          {IDEAS_HUB_ENTRIES.map((h) => (
            <HubToolkitCard key={h.id} h={h} dashboardBase="/dashboard" />
          ))}
        </div>
      </section>
    </main>
  );
}
