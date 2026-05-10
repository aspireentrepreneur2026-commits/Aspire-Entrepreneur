import Link from "next/link";
import { DashboardEntrepreneurHub } from "@/components/dashboard/dashboard-entrepreneur-hub";
import { DashboardRightRail } from "@/components/dashboard/dashboard-right-rail";
import type { DashboardDiscoverMember } from "@/components/dashboard/dashboard-right-rail";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardStoriesStrip } from "@/components/dashboard/dashboard-stories-strip";
import { FeedComposer } from "@/components/feed/feed-composer";
import { FeedPostCard } from "@/components/feed/feed-post-card";
import { getRoleDashboardPath } from "@/lib/auth-redirect";
import { feedAuthorSubtitle } from "@/lib/feed-display-name";
import { feedPostInclude, toFeedPostView } from "@/lib/feed-serialize";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireAuth();
  const myDashboardPath = getRoleDashboardPath(session.user.role);
  const isAdmin = session.user.role === "ADMIN";
  const displayName = session.user.name?.trim() || "Member";
  const initials = displayName.trim().charAt(0).toUpperCase() || "?";

  const [me, feedPosts, publicFeed] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        onboardingStatus: true,
        founderProfile: { select: { startupName: true } },
        mentorProfile: { select: { domainExpertise: true } },
        investorProfile: { select: { firmName: true } },
        primaryGoal: true,
      },
    }),
    prisma.feedPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      include: feedPostInclude,
    }),
    prisma.user.findMany({
      where: { onboardingStatus: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 24,
      select: {
        id: true,
        name: true,
        role: true,
        country: true,
        location: true,
        primaryGoal: true,
        joinAim: true,
        experienceLevel: true,
        createdAt: true,
        founderProfile: {
          select: {
            startupName: true,
            stage: true,
            industry: true,
            fundingNeeded: true,
          },
        },
        mentorProfile: {
          select: {
            domainExpertise: true,
            yearsExperience: true,
            availability: true,
          },
        },
        investorProfile: {
          select: {
            firmName: true,
            checkSizeRange: true,
            investmentStage: true,
            sectorsOfInterest: true,
          },
        },
      },
    }),
  ]);

  const feedViews = feedPosts.map(toFeedPostView);

  const sidebarHeadline = me
    ? feedAuthorSubtitle({
        name: displayName,
        founderProfile: me.founderProfile,
        mentorProfile: me.mentorProfile,
        investorProfile: me.investorProfile,
      })
    : displayName;

  const discoverForRail: DashboardDiscoverMember[] = publicFeed.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    country: m.country,
    location: m.location,
    founderProfile: m.founderProfile ? { startupName: m.founderProfile.startupName } : null,
    mentorProfile: m.mentorProfile ? { domainExpertise: m.mentorProfile.domainExpertise } : null,
    investorProfile: m.investorProfile ? { firmName: m.investorProfile.firmName } : null,
  }));

  return (
    <div className="min-h-[calc(100vh-4rem)] flex-1 bg-[#f3f2ef] pb-10">
      <main className="mx-auto w-full max-w-[1128px] px-3 pt-4 sm:px-4 lg:px-6">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,225px)_minmax(0,555px)_minmax(0,300px)] lg:items-start lg:gap-6">
          <DashboardSidebar
            userName={displayName}
            headline={sidebarHeadline}
            myDashboardHref={myDashboardPath}
            isAdmin={isAdmin}
            onboardingStatus={me?.onboardingStatus}
          />

          <div className="min-w-0 space-y-3 lg:pt-1">
            <DashboardStoriesStrip userInitial={initials} />

            <div className="flex gap-3 overflow-x-auto pb-2 lg:hidden">
              <Shortcut href={myDashboardPath} emoji="📊" label="Workspace" />
              <Shortcut href="/settings" emoji="⚙️" label="Profile" />
              <Shortcut href="/onboarding" emoji="✨" label="Onboarding" />
            </div>

            <div id="feed-start" className="scroll-mt-28 lg:scroll-mt-[5.75rem]">
              <FeedComposer publisherName={displayName} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-4">
              <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-3">
                <span className="text-lg leading-none text-slate-700">┃</span>
                <span className="text-sm font-semibold text-slate-900">Recent updates</span>
              </div>
              <button
                type="button"
                disabled
                className="hidden cursor-not-allowed rounded-full px-4 py-1.5 text-xs font-semibold text-slate-400 sm:block"
                title="Sorting options coming soon"
              >
                Top · Recent
              </button>
            </div>

            {feedViews.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-800">No posts in your feed yet</p>
                <p className="mt-2 text-sm text-slate-600">
                  Share a win, question, article, or video — members can comment below each post.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {feedViews.map((post) => (
                  <FeedPostCard
                    key={post.id}
                    post={post}
                    currentUserId={session.user.id}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            )}

            <DashboardEntrepreneurHub />
          </div>

          <DashboardRightRail members={discoverForRail.filter((x) => x.id !== session.user.id)} />
        </div>

        <section id="discover" className="mt-10 scroll-mt-28 border-t border-slate-300/70 pt-10 lg:hidden">
          <h2 className="text-xl font-semibold text-slate-900">Discover members</h2>
          <p className="mt-1 text-sm text-slate-600">
            Public-safe snapshots of founders, mentors, and investors on the platform.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {publicFeed.map((member) => (
              <DiscoverMemberCard key={member.id} member={member} />
            ))}
          </div>
          <Link
            href={myDashboardPath}
            className="mt-6 inline-flex rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-[#0a66c2] hover:bg-slate-50"
          >
            Open my dashboard →
          </Link>
        </section>

        <section id="discover-desktop" className="mt-12 hidden scroll-mt-28 border-t border-slate-300/70 pt-10 lg:block">
          <div className="rounded-lg border border-slate-200/90 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Explore all members</h2>
            <p className="mt-1 text-sm text-slate-600">
              Full profiles of people who finished onboarding — use this wider layout on small screens from the block
              above.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {publicFeed.map((member) => (
                <DiscoverMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Shortcut({ href, emoji, label }: { href: string; emoji: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
    >
      <span aria-hidden>{emoji}</span>
      {label}
    </Link>
  );
}

/** Single member card for Discover section */
function DiscoverMemberCard({
  member,
}: {
  member: {
    id: string;
    name: string;
    role: string;
    country: string | null;
    location: string | null;
    primaryGoal: string | null;
    joinAim: string | null;
    experienceLevel: string | null;
    createdAt: Date;
    founderProfile: {
      startupName: string;
      stage: string;
      industry: string;
      fundingNeeded: string | null;
    } | null;
    mentorProfile: {
      domainExpertise: string;
      yearsExperience: number;
      availability: string | null;
    } | null;
    investorProfile: {
      firmName: string;
      checkSizeRange: string;
      investmentStage: string;
      sectorsOfInterest: string;
    } | null;
  };
}) {
  const initial = member.name.trim().charAt(0).toUpperCase() || "?";
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-sm transition hover:border-[#0a66c2]/30 hover:shadow-md">
      <div className="flex gap-4 p-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-lg font-semibold text-white">
          {initial}
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0a66c2]">
            {member.role}
          </span>
          <h3 className="text-base font-semibold text-slate-900">{member.name}</h3>
          <p className="truncate text-xs text-slate-500">
            {member.location ?? "Location hidden"}
            {member.country ? ` · ${member.country}` : ""}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-700">
        <p className="line-clamp-2">
          <span className="font-semibold text-slate-900">Goal: </span>
          {member.primaryGoal ?? "—"}
        </p>
      </div>
      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 text-xs text-slate-600">
        <p className="line-clamp-2">
          <span className="font-semibold text-slate-900">Joined because: </span>
          {member.joinAim ?? "—"}
        </p>

        {member.founderProfile ? (
          <div className="mt-3 rounded-md border border-sky-100 bg-sky-50/80 p-2 text-[11px]">
            <p className="font-semibold text-sky-950">Startup</p>
            <p>{member.founderProfile.startupName}</p>
            <p className="text-slate-600">
              {member.founderProfile.stage} · {member.founderProfile.industry}
            </p>
          </div>
        ) : null}

        {member.mentorProfile ? (
          <div className="mt-3 rounded-md border border-violet-100 bg-violet-50/80 p-2 text-[11px]">
            <p className="font-semibold text-violet-950">Mentor</p>
            <p>{member.mentorProfile.domainExpertise}</p>
          </div>
        ) : null}

        {member.investorProfile ? (
          <div className="mt-3 rounded-md border border-fuchsia-100 bg-fuchsia-50/80 p-2 text-[11px]">
            <p className="font-semibold text-fuchsia-950">Investor</p>
            <p>{member.investorProfile.firmName}</p>
          </div>
        ) : null}
      </div>
      <p className="px-4 pb-3 text-[10px] uppercase tracking-wide text-slate-400">
        Joined {new Date(member.createdAt).toLocaleDateString()}
      </p>
    </article>
  );
}
