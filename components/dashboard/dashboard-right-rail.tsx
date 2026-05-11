import Link from "next/link";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileAvatarImg } from "@/components/profile/profile-image-display";
import { feedAuthorSubtitle } from "@/lib/feed-display-name";

/** Shape matches prisma select for dashboard discover slice */
export type DashboardDiscoverMember = {
  id: string;
  name: string;
  role: string;
  image?: string | null;
  profileApprovalStatus?: string;
  country: string | null;
  location: string | null;
  founderProfile: { startupName: string } | null;
  mentorProfile: { domainExpertise: string } | null;
  investorProfile: { firmName: string } | null;
};

function memberSubtitle(m: DashboardDiscoverMember) {
  const fakeAuthor = {
    name: m.name,
    founderProfile: m.founderProfile,
    investorProfile: m.investorProfile,
    mentorProfile: m.mentorProfile,
  };
  return feedAuthorSubtitle(fakeAuthor);
}

const founderPrompts = [
  "What problem are you solving this week — and for whom?",
  "Share one metric you moved (users, revenue, runway, sleep).",
  "Ask the community: would you pay for ___? Why or why not?",
];

const trendingTags = [
  { label: "#idea", href: "/dashboard/ideas" },
  { label: "#newbusiness", href: "/dashboard/startups#new-business-spotlight" },
  { label: "#startups", href: "/dashboard/startups" },
  { label: "#mentorwanted", href: "/dashboard/startups#mentorship-lab" },
  { label: "#funding", href: "/dashboard/startups#funding-desk" },
  { label: "#buildinpublic", href: "/dashboard#feed-start" },
];

export function DashboardRightRail({
  members,
  followingIds,
}: {
  members: DashboardDiscoverMember[];
  followingIds: Set<string>;
}) {
  const prompt = founderPrompts[members.length % founderPrompts.length];

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[5.75rem] space-y-4">
        <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-gradient-to-br from-indigo-50/80 to-white p-4 shadow-sm">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-indigo-900/90">Today’s founder prompt</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-800">{prompt}</p>
          <Link
            href="/dashboard#feed-start"
            className="mt-3 inline-block text-xs font-semibold text-[#0a66c2] hover:underline"
          >
            Answer in a post →
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm">
          <h2 className="text-[15px] font-semibold text-slate-900">Trending themes</h2>
          <p className="mt-1 text-xs text-slate-500">
            Shortcut tags — jump to toolkit sections below the feed or start a post about a theme.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {trendingTags.map((t) => (
              <Link
                key={t.label}
                href={t.href}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#0a66c2]/40 hover:bg-[#e8f3fc] hover:text-[#004182]"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm">
          <h2 className="text-[15px] font-semibold text-slate-900">People in your network</h2>
          <p className="mt-1 text-xs text-slate-500">
            Members who finished onboarding — tap a name to open their profile. Follow when their profile is approved.
          </p>
          <ul className="mt-4 space-y-4">
            {members.slice(0, 8).map((m) => {
              const initials = m.name.trim().charAt(0).toUpperCase() || "?";
              const approved = m.profileApprovalStatus === "APPROVED";
              return (
                <li key={m.id}>
                  <div className="flex gap-3">
                    <Link
                      href={`/members/${m.id}`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-sm font-semibold text-white ring-1 ring-slate-200/80 hover:opacity-95"
                    >
                      <ProfileAvatarImg
                        url={m.image}
                        initial={initials}
                        imgClassName="h-full w-full object-cover"
                        fallbackClassName="text-sm font-semibold"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/members/${m.id}`}
                        className="truncate text-[14px] font-semibold text-slate-900 hover:text-[#0a66c2] hover:underline"
                      >
                        {m.name}
                      </Link>
                      <p className="truncate text-xs text-slate-600">{memberSubtitle(m)}</p>
                      <p className="truncate text-xs text-slate-400">
                        {[m.location, m.country].filter(Boolean).join(" · ") || "Aspire member"}
                      </p>
                      <div className="mt-2">
                        <FollowButton
                          targetUserId={m.id}
                          initialFollowing={followingIds.has(m.id)}
                          canFollow={approved}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <Link
            href="/dashboard#network-members"
            className="mt-4 block pt-3 text-center text-sm font-semibold text-slate-600 hover:text-[#0a66c2]"
          >
            See all in member network →
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-4 shadow-sm">
          <h2 className="text-[13px] font-semibold text-slate-900">Pitch nights & AMAs</h2>
          <p className="mt-1 text-xs text-slate-600">
            Facebook Events–style RSVP and Instagram Live pitches will land here — host or join remotely.
          </p>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="mt-3 w-full cursor-not-allowed rounded-full border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-400"
          >
            Browse events (soon)
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white p-4 shadow-sm">
          <h2 className="text-[13px] font-semibold text-slate-900">Aspire Entrepreneur</h2>
          <ul className="mt-3 space-y-2 text-[11px] text-slate-500">
            <li>
              <a href="#" className="hover:text-[#0a66c2] hover:underline">
                About
              </a>
              {" · "}
              <a href="#" className="hover:text-[#0a66c2] hover:underline">
                Help
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0a66c2] hover:underline">
                Privacy
              </a>
              {" · "}
              <a href="#" className="hover:text-[#0a66c2] hover:underline">
                Terms
              </a>
            </li>
            <li className="pt-1 text-slate-400">Aspire © {new Date().getFullYear()}</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
