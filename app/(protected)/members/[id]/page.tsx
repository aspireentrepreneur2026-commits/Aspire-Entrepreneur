import Link from "next/link";
import { notFound } from "next/navigation";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileAvatarImg, ProfileCoverImg } from "@/components/profile/profile-image-display";
import { feedAuthorSubtitle } from "@/lib/feed-display-name";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function MemberProfilePage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
      image: true,
      coverImageUrl: true,
      primaryGoal: true,
      joinAim: true,
      aboutYourself: true,
      location: true,
      country: true,
      onboardingStatus: true,
      profileApprovalStatus: true,
      profileApprovalNote: true,
      founderProfile: {
        select: {
          startupName: true,
          stage: true,
          industry: true,
          industryExpertiseNarrative: true,
          studyWorkBackground: true,
          achievements: true,
          investmentCapital: true,
          investmentInterest: true,
          investmentHistory: true,
        },
      },
      mentorProfile: {
        select: {
          domainExpertise: true,
          yearsExperience: true,
          industryExpertiseNarrative: true,
          studyWorkBackground: true,
          achievements: true,
          investmentCapital: true,
          investmentInterest: true,
          investmentHistory: true,
        },
      },
      investorProfile: {
        select: {
          firmName: true,
          checkSizeRange: true,
          investmentStage: true,
          sectorsOfInterest: true,
          industryExpertiseNarrative: true,
          studyWorkBackground: true,
          achievements: true,
          investmentCapital: true,
          investmentInterest: true,
          investmentHistory: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const isSelf = session.user.id === user.id;
  const isAdmin = session.user.role === "ADMIN";
  const isApproved = user.profileApprovalStatus === "APPROVED";
  const canViewMemberCard = isSelf || isAdmin || isApproved;

  const [followerCount, followingCount, existingFollow] = await Promise.all([
    prisma.userFollow.count({ where: { followingId: id } }),
    prisma.userFollow.count({ where: { followerId: id } }),
    session.user.id === id
      ? Promise.resolve(null)
      : prisma.userFollow.findUnique({
          where: {
            followerId_followingId: { followerId: session.user.id, followingId: id },
          },
          select: { id: true },
        }),
  ]);

  const subtitle = feedAuthorSubtitle({
    name: user.name,
    founderProfile: user.founderProfile
      ? { startupName: user.founderProfile.startupName }
      : null,
    mentorProfile: user.mentorProfile ? { domainExpertise: user.mentorProfile.domainExpertise } : null,
    investorProfile: user.investorProfile ? { firmName: user.investorProfile.firmName } : null,
  });

  const extended =
    user.role === "FOUNDER"
      ? user.founderProfile
      : user.role === "MENTOR"
        ? user.mentorProfile
        : user.role === "INVESTOR"
          ? user.investorProfile
          : null;

  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-12 pt-4 sm:px-6">
      <Link href="/dashboard" className="text-sm font-medium text-[#0a66c2] hover:underline">
        ← Back to dashboard
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
        <div className="relative h-36 bg-gradient-to-r from-slate-700 to-slate-900 sm:h-44">
          {user.coverImageUrl?.trim() ? (
            <ProfileCoverImg url={user.coverImageUrl} className="h-full w-full object-cover" />
          ) : null}
        </div>

        <div className="relative px-6 pb-8 pt-0">
          <div className="-mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-[#0a66c2] to-[#004182] text-3xl font-bold text-white shadow-lg ring-1 ring-slate-200/80">
                <ProfileAvatarImg
                  url={user.image}
                  initial={initial}
                  imgClassName="h-full w-full rounded-full object-cover"
                  fallbackClassName="text-3xl font-bold"
                />
              </div>
              <div className="min-w-0 pb-1 pt-12 sm:pt-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0a66c2]">{user.role}</p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{user.name}</h1>
                <p className="mt-0.5 text-sm text-slate-600">{subtitle}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {followerCount} follower{followerCount === 1 ? "" : "s"} · {followingCount} following
                </p>
              </div>
            </div>

            {!isSelf ? (
              <FollowButton
                targetUserId={user.id}
                initialFollowing={!!existingFollow}
                canFollow={isApproved}
              />
            ) : (
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                <Link
                  href="/settings"
                  className="inline-flex justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Edit profile & photos
                </Link>
                {user.role !== "ADMIN" ? (
                  <Link
                    href="/settings/extended-profile"
                    className="inline-flex justify-center rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#004182]"
                  >
                    Professional depth
                  </Link>
                ) : null}
              </div>
            )}
          </div>

          {!canViewMemberCard ? (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-950">
              {user.profileApprovalStatus === "PENDING" ? (
                <>
                  <p className="font-semibold">Profile is pending review</p>
                  <p className="mt-2 text-amber-900/90">
                    This member&apos;s public card is not visible yet. Check back after an admin approves the profile.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Profile not available</p>
                  <p className="mt-2 text-amber-900/90">
                    An administrator has restricted this profile for other members.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="mt-8 space-y-6 border-t border-slate-100 pt-8">
              {isAdmin || isSelf ? (
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  Status:{" "}
                  <span className="font-semibold text-slate-800">{user.profileApprovalStatus}</span>
                  {user.profileApprovalNote ? (
                    <span className="mt-1 block text-slate-600">Admin note: {user.profileApprovalNote}</span>
                  ) : null}
                </p>
              ) : null}

              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Primary goal</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-800">{user.primaryGoal ?? "—"}</p>
              </section>

              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Why they joined (aim)
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-800">{user.joinAim ?? "—"}</p>
              </section>

              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">About</h2>
                <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
                  {user.aboutYourself ?? "—"}
                </p>
              </section>

              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Location</h2>
                <p className="mt-2 text-sm text-slate-700">
                  {[user.location, user.country].filter(Boolean).join(" · ") || "—"}
                </p>
              </section>

              {extended &&
              "industryExpertiseNarrative" in extended &&
              (extended.industryExpertiseNarrative ||
                extended.studyWorkBackground ||
                extended.achievements ||
                extended.investmentCapital ||
                extended.investmentInterest ||
                extended.investmentHistory) ? (
                <section className="rounded-xl border border-slate-100 bg-slate-50/80 p-5">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                    Professional depth
                  </h2>
                  <dl className="mt-4 space-y-4 text-sm">
                    <ProfileRow label="Industry expertise" value={extended.industryExpertiseNarrative} />
                    <ProfileRow label="Study & work background" value={extended.studyWorkBackground} />
                    <ProfileRow label="Achievements" value={extended.achievements} />
                    <ProfileRow label="Investment capital" value={extended.investmentCapital} />
                    <ProfileRow label="Investment interest" value={extended.investmentInterest} />
                    <ProfileRow label="Investment history" value={extended.investmentHistory} />
                  </dl>
                </section>
              ) : null}

              {user.role === "FOUNDER" && user.founderProfile ? (
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Startup snapshot</h2>
                  <p className="mt-2 text-sm text-slate-800">
                    <span className="font-medium">{user.founderProfile.startupName}</span> ·{" "}
                    {user.founderProfile.stage} · {user.founderProfile.industry}
                  </p>
                </section>
              ) : null}

              {user.role === "MENTOR" && user.mentorProfile ? (
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Mentorship</h2>
                  <p className="mt-2 text-sm text-slate-800">
                    {user.mentorProfile.yearsExperience}+ years · {user.mentorProfile.domainExpertise}
                  </p>
                </section>
              ) : null}

              {user.role === "INVESTOR" && user.investorProfile ? (
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Investment focus</h2>
                  <p className="mt-2 text-sm text-slate-800">
                    {user.investorProfile.firmName} · {user.investorProfile.checkSizeRange} ·{" "}
                    {user.investorProfile.investmentStage}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{user.investorProfile.sectorsOfInterest}</p>
                </section>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ProfileRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">{value}</dd>
    </div>
  );
}
