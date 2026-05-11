import Link from "next/link";
import type { DiscoverMember } from "@/lib/discover-search";

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (value == null || String(value).trim() === "") return null;
  return (
    <div className="min-w-0 sm:col-span-1">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 break-words text-sm text-slate-900">{value}</dd>
    </div>
  );
}

export function DiscoverMemberResults({ members }: { members: DiscoverMember[] }) {
  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
        <p className="text-sm font-semibold text-slate-800">No members match these filters</p>
        <p className="mt-2 text-sm text-slate-600">
          Try broader keywords, set type to &quot;All&quot;, or clear location — only people who finished onboarding
          appear here.
        </p>
        <Link href="/dashboard/network" className="mt-4 inline-block text-sm font-semibold text-[#0a66c2] hover:underline">
          Browse full member network →
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {members.map((m) => (
        <li key={m.id}>
          <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0a66c2]/35 hover:shadow-md">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0a66c2]">{m.role}</p>
                <h3 className="mt-0.5 truncate text-base font-semibold text-slate-900">{m.name}</h3>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  m.profileApprovalStatus === "APPROVED"
                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80"
                    : "bg-amber-50 text-amber-900 ring-1 ring-amber-200/80"
                }`}
              >
                {m.profileApprovalStatus.toLowerCase()}
              </span>
            </div>

            <dl className="mt-3 grid flex-1 grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <Row label="Email" value={m.email} />
              <Row label="Phone" value={m.phoneNumber ?? undefined} />
              <Row label="Location" value={m.location ?? undefined} />
              <Row label="Country" value={m.country ?? undefined} />
              <Row label="Primary goal" value={m.primaryGoal ?? undefined} />
              <Row label="Join aim" value={m.joinAim ?? undefined} />
              {m.founderProfile ? (
                <>
                  <Row label="Business" value={m.founderProfile.startupName} />
                  <Row label="Stage" value={m.founderProfile.stage} />
                  <Row label="Industry" value={m.founderProfile.industry} />
                  <Row label="Funding" value={m.founderProfile.fundingNeeded ?? undefined} />
                  <Row label="Team size" value={m.founderProfile.teamSize ?? undefined} />
                </>
              ) : null}
              {m.mentorProfile ? (
                <>
                  <Row label="Expertise" value={m.mentorProfile.domainExpertise} />
                  <Row
                    label="Experience"
                    value={m.mentorProfile.yearsExperience != null ? `${m.mentorProfile.yearsExperience}+ yrs` : undefined}
                  />
                </>
              ) : null}
              {m.investorProfile ? (
                <>
                  <Row label="Firm" value={m.investorProfile.firmName} />
                  <Row label="Check size" value={m.investorProfile.checkSizeRange} />
                  <Row label="Stage focus" value={m.investorProfile.investmentStage} />
                  <Row label="Sectors" value={m.investorProfile.sectorsOfInterest} />
                </>
              ) : null}
            </dl>

            <div className="mt-4 border-t border-slate-100 pt-3">
              <Link
                href={`/members/${m.id}`}
                className="text-sm font-semibold text-[#0a66c2] hover:underline"
              >
                View profile →
              </Link>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
