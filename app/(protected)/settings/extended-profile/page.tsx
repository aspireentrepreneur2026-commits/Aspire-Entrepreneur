import Link from "next/link";
import { redirect } from "next/navigation";
import { ExtendedProfileForm } from "@/components/profile/extended-profile-form";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export default async function ExtendedProfileSettingsPage() {
  const session = await requireAuth();
  const role = session.user.role;

  if (role === "ADMIN" || !role) {
    redirect("/settings");
  }
  if (role !== "FOUNDER" && role !== "MENTOR" && role !== "INVESTOR") {
    redirect("/settings");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      onboardingStatus: true,
      extendedProfileCompletedAt: true,
      founderProfile: {
        select: {
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

  if (!user || user.onboardingStatus !== "COMPLETED") {
    redirect("/onboarding");
  }

  const profile =
    role === "FOUNDER"
      ? user.founderProfile
      : role === "MENTOR"
        ? user.mentorProfile
        : user.investorProfile;

  if (!profile) {
    redirect("/settings");
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link href="/settings" className="text-sm font-medium text-[#0a66c2] hover:underline">
        ← Back to settings
      </Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Professional depth profile</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Add richer context after onboarding — aligned with your role as{" "}
          <span className="font-semibold text-slate-800">{role}</span>. This appears on your public member profile
          when your account is approved.
        </p>
        {user.extendedProfileCompletedAt ? (
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900">
            Last completed {new Date(user.extendedProfileCompletedAt).toLocaleString()} — you can update anytime.
          </p>
        ) : null}

        <div className="mt-8">
          <ExtendedProfileForm role={role} defaults={profile} />
        </div>
      </div>
    </main>
  );
}
