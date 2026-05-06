import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function MentorDashboardPage() {
  const session = await requireRole(["MENTOR"]);
  const [user, mentorProfile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, onboardingStatus: true },
    }),
    prisma.mentorProfile.findUnique({
      where: { userId: session.user.id },
      select: { yearsExperience: true, domainExpertise: true, availability: true },
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-100">Mentor dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold">Welcome, {user?.name ?? "Mentor"}</h1>
          <p className="mt-2 text-violet-100">
            Showcase expertise, set availability, and connect with startup founders.
          </p>
        </div>
        <div className="grid gap-4 p-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Expertise</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {mentorProfile?.domainExpertise ?? "Complete onboarding"}
            </p>
            <p className="text-sm text-slate-600">
              Experience: {mentorProfile?.yearsExperience ? `${mentorProfile.yearsExperience} years` : "Not set"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Availability</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {mentorProfile?.availability ?? "Not set"}
            </p>
            <p className="text-sm text-slate-600">Email: {user?.email ?? session.user.email}</p>
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
