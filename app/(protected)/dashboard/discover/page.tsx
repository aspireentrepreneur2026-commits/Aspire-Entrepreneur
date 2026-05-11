import Link from "next/link";
import { DiscoverFiltersForm } from "@/components/dashboard/discover-filters-form";
import { DiscoverMemberResults } from "@/components/dashboard/discover-member-results";
import { discoverSearchMembers } from "@/lib/discover-search";
import { requireAuth } from "@/lib/session";

type Search = { q?: string; type?: string; location?: string };

export default async function DiscoverPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Search>;
}>) {
  const session = await requireAuth();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const type = (sp.type ?? "").trim();
  const location = (sp.location ?? "").trim();

  const hasSearched =
    q.length > 0 ||
    location.length > 0 ||
    (type.length > 0 && type.toLowerCase() !== "all");

  const members = hasSearched
    ? await discoverSearchMembers({
        viewerId: session.user.id,
        q: q || undefined,
        type: type || undefined,
        location: location || undefined,
      })
    : [];

  return (
    <main className="mx-auto w-full max-w-[1128px] flex-1 px-4 pb-16 pt-6 sm:px-6">
      <Link href="/dashboard" className="text-sm font-medium text-[#0a66c2] hover:underline">
        ← Back to home feed
      </Link>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-100 bg-gradient-to-r from-[#0a66c2] to-[#004182] px-6 py-8 text-white sm:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">Discover</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Search members &amp; companies</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-indigo-100">
            Profiles appear only after you run a search — use keywords, location, or a role chip, then{" "}
            <strong className="font-semibold text-white">Search</strong>.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10">
          <DiscoverFiltersForm initialQ={q || undefined} initialType={type || undefined} initialLocation={location || undefined} />

          <section className="mt-10" aria-labelledby="discover-results-heading">
            {hasSearched ? (
              <>
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 id="discover-results-heading" className="text-lg font-semibold text-slate-900">
                      Results
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Up to 48 matches · signed-in members only · contact fields stay inside Aspire
                    </p>
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    <span className="text-slate-400">Keywords:</span> {q || "—"} ·{" "}
                    <span className="text-slate-400">Type:</span> {type || "all"} ·{" "}
                    <span className="text-slate-400">Location:</span> {location || "—"}
                  </p>
                </div>
                <div className="pt-6">
                  <DiscoverMemberResults members={members} />
                </div>
              </>
            ) : (
              <div
                id="discover-results-heading"
                className="rounded-xl border border-dashed border-slate-200 bg-slate-50/90 px-6 py-14 text-center"
              >
                <h2 className="text-lg font-semibold text-slate-900">No search yet</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                  Enter keywords or a location and click <strong className="text-slate-800">Search</strong>, or choose a
                  role under <strong className="text-slate-800">Show me</strong> (e.g. Mentors). Member profiles load
                  here only after the URL includes those filters.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
