import Link from "next/link";
import { STARTUPS_TOOLKIT_ENTRIES } from "@/components/dashboard/entrepreneur-hub-data";
import { HubToolkitCard } from "@/components/dashboard/hub-toolkit-card";
import { requireAuth } from "@/lib/session";

export default async function StartupsWorkspacePage() {
  await requireAuth();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 sm:px-6">
      <Link href="/dashboard" className="text-sm font-medium text-[#0a66c2] hover:underline">
        ← Back to home feed
      </Link>

      <header className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0a66c2]">Startups workspace</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Startups, SMEs &amp; growth</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          New businesses, funding, mentorship, and startup momentum — moved here from the old &quot;Business&quot;
          toolkit tab so <strong className="font-semibold text-slate-800">Discover</strong> on the dashboard can
          become your LinkedIn-style search hub.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-5">
        {STARTUPS_TOOLKIT_ENTRIES.map((h) => (
          <HubToolkitCard key={h.id} h={h} dashboardBase="/dashboard" />
        ))}
      </div>
    </main>
  );
}
