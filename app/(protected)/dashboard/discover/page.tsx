import Link from "next/link";
import { DiscoverFiltersForm } from "@/components/dashboard/discover-filters-form";
import { DiscoverMemberResults } from "@/components/dashboard/discover-member-results";
import { discoverSearchMembers } from "@/lib/discover-search";
import { requireAuth } from "@/lib/session";

type Search = {
  q?: string;
  type?: string;
  contact?: string;
  /** @deprecated use `contact`; still read for old links */
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  company?: string;
  investmentRange?: string;
  teamSize?: string;
};

export default async function DiscoverPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<Search>;
}>) {
  const session = await requireAuth();
  const sp = await searchParams;
  const contact =
    (sp.contact ?? "").trim() ||
    (sp.name ?? "").trim() ||
    (sp.email ?? "").trim() ||
    (sp.phone ?? "").trim();
  const location = (sp.location ?? "").trim();
  const company = (sp.company ?? "").trim();
  const investmentRange = (sp.investmentRange ?? "").trim();
  const teamSize = (sp.teamSize ?? "").trim();
  const q = (sp.q ?? "").trim();
  const type = (sp.type ?? "").trim();

  const hasSearched =
    contact.length > 0 ||
    location.length > 0 ||
    company.length > 0 ||
    investmentRange.length > 0 ||
    teamSize.length > 0 ||
    q.length > 0 ||
    (type.length > 0 && type.toLowerCase() !== "all");

  const members = hasSearched
    ? await discoverSearchMembers({
        viewerId: session.user.id,
        contact: contact || undefined,
        location: location || undefined,
        company: company || undefined,
        investmentRange: investmentRange || undefined,
        teamSize: teamSize || undefined,
        q: q || undefined,
        type: type || undefined,
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
            One bar: name or email or phone, company, location, investment range, and team size — then{" "}
            <strong className="font-semibold text-white">Search</strong> or use <strong className="font-semibold text-white">Show me</strong>.
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10">
          <DiscoverFiltersForm
            initialContact={contact || undefined}
            initialLocation={location || undefined}
            initialCompany={company || undefined}
            initialInvestmentRange={investmentRange || undefined}
            initialTeamSize={teamSize || undefined}
            initialQ={q || undefined}
            initialType={type || undefined}
          />

          <section className="mt-10" aria-labelledby="discover-results-heading">
            {hasSearched ? (
              <>
                <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 id="discover-results-heading" className="text-lg font-semibold text-slate-900">
                      Results
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Up to 48 matches · signed-in members only
                    </p>
                  </div>
                  <p className="max-w-2xl text-right text-[11px] font-medium leading-snug text-slate-600 sm:text-xs">
                    <span className="text-slate-400">Contact</span> {contact || "—"} · <span className="text-slate-400">Co</span>{" "}
                    {company || "—"} · <span className="text-slate-400">Loc</span> {location || "—"} ·{" "}
                    <span className="text-slate-400">$</span> {investmentRange || "—"} · <span className="text-slate-400">Team</span>{" "}
                    {teamSize || "—"} · <span className="text-slate-400">Type</span> {type || "all"}
                    {q ? (
                      <>
                        <br />
                        <span className="text-slate-400">Keywords</span> {q}
                      </>
                    ) : null}
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
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
                  Fill the row above (scroll horizontally on small screens) or pick a <strong className="text-slate-800">Show me</strong>{" "}
                  filter, then <strong className="text-slate-800">Search</strong>. The first box matches <strong className="text-slate-800">name</strong>,{" "}
                  <strong className="text-slate-800">email</strong>, or <strong className="text-slate-800">phone</strong>. Company matches startup or investor firm;
                  investment range matches founder funding text or investor cheque range; team size matches founder team size.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
