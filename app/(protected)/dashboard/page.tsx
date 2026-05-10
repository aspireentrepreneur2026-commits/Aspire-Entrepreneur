import Link from "next/link";
import { requireAuth } from "@/lib/session";
import { getRoleDashboardPath } from "@/lib/auth-redirect";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await requireAuth();
  const myDashboardPath = getRoleDashboardPath(session.user.role);

  const publicFeed = await prisma.user.findMany({
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
  });

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
      <section className="mb-8 rounded-3xl border border-indigo-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-[0.18em] text-indigo-600">Portal dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Community activity feed</h1>
        <p className="mt-2 text-sm text-slate-600">
          Public-safe profiles of people and teams joining Aspire Entrepreneur.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={myDashboardPath}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Open my dashboard
          </Link>
          <Link
            href="/onboarding"
            className="rounded-md border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
          >
            Complete onboarding
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {publicFeed.map((member) => (
          <article
            key={member.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
          >
            <p className="text-xs uppercase tracking-wide text-indigo-600">{member.role}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{member.name}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {member.location ?? "Location not shared"}
              {member.country ? `, ${member.country}` : ""}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-medium">Goal:</span> {member.primaryGoal ?? "Not shared"}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-medium">Reason to join:</span> {member.joinAim ?? "Not shared"}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-medium">Experience:</span> {member.experienceLevel ?? "Not shared"}
            </p>

            {member.founderProfile ? (
              <div className="mt-3 rounded-lg border border-cyan-100 bg-cyan-50 p-3 text-sm text-slate-700">
                <p className="font-medium text-cyan-800">Founder/Startup</p>
                <p>Startup: {member.founderProfile.startupName}</p>
                <p>Stage: {member.founderProfile.stage}</p>
                <p>Industry: {member.founderProfile.industry}</p>
                <p>Funding need: {member.founderProfile.fundingNeeded ?? "Not shared"}</p>
              </div>
            ) : null}

            {member.mentorProfile ? (
              <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50 p-3 text-sm text-slate-700">
                <p className="font-medium text-violet-800">Mentor</p>
                <p>Expertise: {member.mentorProfile.domainExpertise}</p>
                <p>Experience: {member.mentorProfile.yearsExperience} years</p>
                <p>Availability: {member.mentorProfile.availability ?? "Not shared"}</p>
              </div>
            ) : null}

            {member.investorProfile ? (
              <div className="mt-3 rounded-lg border border-fuchsia-100 bg-fuchsia-50 p-3 text-sm text-slate-700">
                <p className="font-medium text-fuchsia-800">Investor</p>
                <p>Firm: {member.investorProfile.firmName}</p>
                <p>Check range: {member.investorProfile.checkSizeRange}</p>
                <p>Stage: {member.investorProfile.investmentStage}</p>
                <p>Sectors: {member.investorProfile.sectorsOfInterest}</p>
              </div>
            ) : null}

            <p className="mt-3 text-xs text-slate-500">
              Joined: {new Date(member.createdAt).toLocaleDateString()}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
