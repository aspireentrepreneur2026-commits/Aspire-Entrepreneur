import Link from "next/link";
import { MemberNetworkSection } from "@/components/dashboard/member-network-section";
import { getRoleDashboardPath } from "@/lib/auth-redirect";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export default async function NetworkPage() {
  const session = await requireAuth();
  const myDashboardPath = getRoleDashboardPath(session.user.role);

  const memberNetworkRows = await prisma.user.findMany({
    where: { onboardingStatus: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    take: 48,
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
  });

  return (
    <main className="mx-auto w-full max-w-[1128px] flex-1 px-4 pb-16 pt-6 sm:px-6">
      <Link href="/dashboard" className="text-sm font-medium text-[#0a66c2] hover:underline">
        ← Back to home feed
      </Link>

      <header className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0a66c2]">Network</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Member network</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Browse members who finished onboarding. Open a card to view their full profile, follow them from the home
          feed rail, or use <Link href="/dashboard/discover" className="font-semibold text-[#0a66c2] hover:underline">Discover</Link>{" "}
          for filtered search.
        </p>
      </header>

      <div className="mt-10">
        <MemberNetworkSection members={memberNetworkRows} myDashboardHref={myDashboardPath} />
      </div>
    </main>
  );
}
