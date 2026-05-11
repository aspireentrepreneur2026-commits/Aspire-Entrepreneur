import Link from "next/link";
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

  const [me, feedPosts, memberNetworkRows, myFollows] = await Promise.all([
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
        image: true,
        profileApprovalStatus: true,
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
    prisma.userFollow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
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

  const followingIds = new Set(myFollows.map((f) => f.followingId));

  const networkRailSlice: DashboardDiscoverMember[] = memberNetworkRows.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    image: m.image,
    profileApprovalStatus: m.profileApprovalStatus,
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
              <Shortcut href="/members/me" emoji="🪪" label="My profile" />
              <Shortcut href="/settings" emoji="⚙️" label="Settings" />
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
          </div>

          <DashboardRightRail
            members={networkRailSlice.filter((x) => x.id !== session.user.id)}
            followingIds={followingIds}
          />
        </div>
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
