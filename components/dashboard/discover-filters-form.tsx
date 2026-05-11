import Link from "next/link";

const ENTITY_TYPES = [
  { id: "all", label: "All" },
  { id: "people", label: "People" },
  { id: "founders", label: "Founders" },
  { id: "mentors", label: "Mentors" },
  { id: "investors", label: "Investors" },
  { id: "startups", label: "Startups & companies" },
  { id: "ideas", label: "Ideas & posts" },
] as const;

function discoverHref(next: { q?: string; type?: string; location?: string }) {
  const params = new URLSearchParams();
  if (next.q?.trim()) params.set("q", next.q.trim());
  if (next.type && next.type !== "all") params.set("type", next.type);
  if (next.location?.trim()) params.set("location", next.location.trim());
  const qs = params.toString();
  return qs ? `/dashboard/discover?${qs}` : "/dashboard/discover";
}

export function DiscoverFiltersForm({
  initialQ,
  initialType,
  initialLocation,
}: {
  initialQ?: string;
  initialType?: string;
  initialLocation?: string;
}) {
  const activeType = ENTITY_TYPES.some((e) => e.id === initialType) ? (initialType ?? "all") : "all";

  return (
    <div className="space-y-6">
      <form action="/dashboard/discover" method="get" className="space-y-4">
        <div>
          <label htmlFor="discover-q" className="text-sm font-semibold text-slate-800">
            Keywords
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="discover-q"
              name="q"
              type="search"
              defaultValue={initialQ ?? ""}
              placeholder="Skills, startup name, sector, school, title…"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#0a66c2] focus:outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-[#0a66c2] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#004182]"
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="discover-loc" className="text-sm font-semibold text-slate-800">
            Location
          </label>
          <input
            id="discover-loc"
            name="location"
            type="text"
            defaultValue={initialLocation ?? ""}
            placeholder="City, country, timezone…"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-[#0a66c2] focus:outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
          />
        </div>

        {activeType !== "all" ? <input type="hidden" name="type" value={activeType} /> : null}
      </form>

      <div>
        <p className="text-sm font-semibold text-slate-800">Show me</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ENTITY_TYPES.map((e) => (
            <Link
              key={e.id}
              href={discoverHref({
                q: initialQ,
                type: e.id,
                location: initialLocation,
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
