import Link from "next/link";
import { IDEAS_HUB_ENTRIES } from "@/components/dashboard/entrepreneur-hub-data";
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
          Validation, discovery, and playbooks — the same cards that used to sit under the &quot;Ideas&quot; tab on the
          dashboard, now on a dedicated page so the home feed can focus on updates and discover.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-5">
        {IDEAS_HUB_ENTRIES.map((h) => (
          <HubToolkitCard key={h.id} h={h} dashboardBase="/dashboard" />
        ))}
      </div>
    </main>
  );
}
