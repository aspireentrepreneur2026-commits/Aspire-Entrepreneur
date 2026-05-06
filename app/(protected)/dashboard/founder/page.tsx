import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function FounderDashboardPage() {
  const session = await requireRole(["FOUNDER"]);
  const [user, founderProfile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phoneNumber: true,
        country: true,
        location: true,
        primaryGoal: true,
        onboardingStatus: true,
      },
    }),
    prisma.founderProfile.findUnique({
      where: { userId: session.user.id },
      select: { startupName: true, stage: true, industry: true, fundingNeeded: true },
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-indigo-100">Founder dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold">Welcome, {user?.name ?? "Founder"}</h1>
          <p className="mt-2 text-indigo-100">
            Manage startup profile, track traction signals, and prepare for mentors and investors.
          </p>
        </div>
        <div className="grid gap-4 p-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Startup</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {founderProfile?.startupName ?? "Complete onboarding"}
            </p>
            <p className="text-sm text-slate-600">
              Stage: {founderProfile?.stage ?? "Not set"} | Industry: {founderProfile?.industry ?? "Not set"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Funding target</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {founderProfile?.fundingNeeded ?? "Add in onboarding/settings"}
            </p>
            <p className="text-sm text-slate-600">Email: {user?.email ?? session.user.email}</p>
            <p className="text-sm text-slate-600">Phone: {user?.phoneNumber ?? "Not set"}</p>
            <p className="text-sm text-slate-600">
              Location: {user?.location ?? "Not set"}, {user?.country ?? "Not set"}
            </p>
            <p className="text-sm text-slate-600">Goal: {user?.primaryGoal ?? "Not set"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 px-8 pb-8">
          <Link
            href={user?.onboardingStatus === "COMPLETED" ? "/settings" : "/onboarding"}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {user?.onboardingStatus === "COMPLETED" ? "Update profile" : "Complete onboarding"}
          </Link>
        </div>
      </div>
    </main>
  );
}
