import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** In-app reminder after onboarding to fill industry / background / investment depth (per role). */
export async function ExtendedProfileReminder() {
  const session = await auth();
  if (!session?.user?.id || session.user.role === "ADMIN") {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingStatus: true, extendedProfileCompletedAt: true },
  });

  if (!user || user.onboardingStatus !== "COMPLETED" || user.extendedProfileCompletedAt) {
    return null;
  }

  return (
    <div className="border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50/80 px-4 py-3 text-center shadow-sm">
      <p className="text-sm font-medium text-amber-950">
        Complete your <strong>professional depth profile</strong> — industry expertise, study & work background,
        achievements, and investment details (tailored to your role).
      </p>
      <Link
        href="/settings/extended-profile"
        className="mt-2 inline-flex rounded-full bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
      >
        Fill professional profile →
      </Link>
    </div>
  );
}
