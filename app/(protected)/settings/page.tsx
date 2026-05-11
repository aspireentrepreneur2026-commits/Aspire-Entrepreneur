import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { UpdateProfileForm } from "@/components/auth/update-profile-form";
import { ProfileMediaForm } from "@/components/profile/profile-media-form";
import { requireAuth } from "@/lib/session";

export default async function SettingsPage() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      emailVerified: true,
      phoneVerifiedAt: true,
      onboardingStatus: true,
      extendedProfileCompletedAt: true,
      role: true,
      phoneNumber: true,
      country: true,
      location: true,
      joinAim: true,
      aboutYourself: true,
      experienceLevel: true,
      primaryGoal: true,
      linkedinUrl: true,
      image: true,
      coverImageUrl: true,
      profileApprovalStatus: true,
      profileApprovalNote: true,
      founderProfile: true,
      mentorProfile: true,
      investorProfile: true,
    },
  });

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="mb-6 overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <h1 className="text-2xl font-semibold">Account settings</h1>
          <p className="mt-1 text-indigo-100">Manage your basic profile details.</p>
        </div>
        <div className="space-y-1 p-6 text-sm text-slate-700">
          <p>
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
          <p>
            Role: <span className="font-medium">{user.role}</span>
          </p>
          <p>
            Email verification:{" "}
            <span className="font-medium">{user.emailVerified ? "Verified" : "Not verified"}</span>
          </p>
          <p>
            Phone verification:{" "}
            <span className="font-medium">{user.phoneVerifiedAt ? "Verified" : "Not verified"}</span>
          </p>
        </div>
      </div>

      {user.role !== "ADMIN" &&
      user.onboardingStatus === "COMPLETED" &&
      ["FOUNDER", "MENTOR", "INVESTOR"].includes(user.role) ? (
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Professional depth</h2>
              <p className="mt-1 text-sm text-slate-600">
                Industry expertise, background, achievements, and (where relevant) investment context. Shown on your
                member profile after you complete it.
              </p>
              {user.extendedProfileCompletedAt ? (
                <p className="mt-2 text-xs text-slate-500">
                  Last saved {new Date(user.extendedProfileCompletedAt).toLocaleString()} — you can update anytime.
                </p>
              ) : (
                <p className="mt-2 text-xs font-medium text-amber-800">
                  Not completed yet — add this so other members see the full picture.
                </p>
              )}
            </div>
            <Link
              href="/settings/extended-profile"
              className="inline-flex shrink-0 justify-center rounded-full bg-[#0a66c2] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#004182]"
            >
              {user.extendedProfileCompletedAt ? "Edit" : "Complete"}
            </Link>
          </div>
        </div>
      ) : null}

      {user.profileApprovalStatus !== "APPROVED" ? (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <span className="font-semibold">Profile visibility: {user.profileApprovalStatus}</span>
          {user.profileApprovalNote ? (
            <p className="mt-1 text-amber-900/90">Admin note: {user.profileApprovalNote}</p>
          ) : null}
          <p className="mt-2 text-xs text-amber-900/80">
            Other members only see your full card when an admin sets your profile to Approved.
          </p>
        </div>
      ) : null}

      <div className="mb-6">
        <ProfileMediaForm initialAvatarUrl={user.image} initialCoverUrl={user.coverImageUrl} />
      </div>

      <UpdateProfileForm user={user} />
    </main>
  );
}
