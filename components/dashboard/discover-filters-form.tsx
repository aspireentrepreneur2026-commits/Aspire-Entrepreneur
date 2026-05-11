import Link from "next/link";

const ENTITY_TYPES = [
  { id: "all", label: "All" },
  { id: "people", label: "People" },
  { id: "founders", label: "Founders" },
  { id: "mentors", label: "Mentors" },
  { id: "investors", label: "Investors" },
  { id: "startups", label: "Business & companies" },
  { id: "ideas", label: "Ideas & posts" },
] as const;

export type DiscoverHrefFilters = {
  contact?: string;
  location?: string;
  company?: string;
  investmentRange?: string;
  teamSize?: string;
  q?: string;
  type?: string;
};

export function discoverSearchHref(next: DiscoverHrefFilters): string {
  const params = new URLSearchParams();
  if (next.contact?.trim()) params.set("contact", next.contact.trim());
  if (next.location?.trim()) params.set("location", next.location.trim());
  if (next.company?.trim()) params.set("company", next.company.trim());
  if (next.investmentRange?.trim()) params.set("investmentRange", next.investmentRange.trim());
  if (next.teamSize?.trim()) params.set("teamSize", next.teamSize.trim());
  if (next.q?.trim()) params.set("q", next.q.trim());
  if (next.type && next.type !== "all") params.set("type", next.type);
  const qs = params.toString();
  return qs ? `/dashboard/discover?${qs}` : "/dashboard/discover";
}

const fieldClass =
  "h-10 w-full min-w-[6.5rem] flex-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#0a66c2] focus:outline-none focus:ring-2 focus:ring-[#0a66c2]/20 sm:min-w-0 sm:px-3 sm:text-sm";

export function DiscoverFiltersForm({
  initialContact,
  initialLocation,
  initialCompany,
  initialInvestmentRange,
  initialTeamSize,
  initialQ,
  initialType,
}: {
  initialContact?: string;
  initialLocation?: string;
  initialCompany?: string;
  initialInvestmentRange?: string;
  initialTeamSize?: string;
  initialQ?: string;
  initialType?: string;
}) {
  const activeType = ENTITY_TYPES.some((e) => e.id === initialType) ? (initialType ?? "all") : "all";

  const chipBase: DiscoverHrefFilters = {
    contact: initialContact,
    location: initialLocation,
    company: initialCompany,
    investmentRange: initialInvestmentRange,
    teamSize: initialTeamSize,
    q: initialQ,
  };

  return (
    <div className="space-y-6">
      <form action="/dashboard/discover" method="get" className="w-full">
        <div className="w-full overflow-x-auto px-[3%]">
          <div className="flex w-full max-w-full flex-nowrap items-center gap-1.5 sm:gap-2">
            <div className="min-w-0 flex-1">
              <label htmlFor="discover-contact" className="sr-only">
                Name, email, or phone
              </label>
              <input
                id="discover-contact"
                name="contact"
                type="search"
                autoComplete="off"
                defaultValue={initialContact ?? ""}
                placeholder="Name, email, or phone"
                className={fieldClass}
              />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="discover-company" className="sr-only">
                Company name
              </label>
              <input
                id="discover-company"
                name="company"
                type="text"
                defaultValue={initialCompany ?? ""}
                placeholder="Company name"
                className={fieldClass}
              />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="discover-loc" className="sr-only">
                Location
              </label>
              <input
                id="discover-loc"
                name="location"
                type="text"
                defaultValue={initialLocation ?? ""}
                placeholder="Location"
                className={fieldClass}
              />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="discover-investment" className="sr-only">
                Investment or cheque range
              </label>
              <input
                id="discover-investment"
                name="investmentRange"
                type="text"
                defaultValue={initialInvestmentRange ?? ""}
                placeholder="Investment range"
                className={fieldClass}
              />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="discover-team" className="sr-only">
                Team size
              </label>
              <input
                id="discover-team"
                name="teamSize"
                type="text"
                defaultValue={initialTeamSize ?? ""}
                placeholder="Team size"
                className={fieldClass}
              />
            </div>
            <div className="shrink-0">
              <span className="sr-only">Submit search</span>
              <button
                type="submit"
                className="h-10 whitespace-nowrap rounded-lg bg-[#0a66c2] px-3 text-xs font-semibold text-white shadow-sm hover:bg-[#004182] sm:px-5 sm:text-sm"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {initialQ ? <input type="hidden" name="q" value={initialQ} /> : null}
        {activeType !== "all" ? <input type="hidden" name="type" value={activeType} /> : null}
      </form>

      <div>
        <p className="text-sm font-semibold text-slate-800">Show me</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ENTITY_TYPES.map((e) => (
            <Link
              key={e.id}
              href={discoverSearchHref({
                ...chipBase,
                type: e.id,
              })}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                e.id === "all"
                  ? activeType === "all"
                    ? "border-[#0a66c2] bg-[#e8f3fc] text-[#004182]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  : activeType === e.id
                    ? "border-[#0a66c2] bg-[#e8f3fc] text-[#004182]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {e.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
