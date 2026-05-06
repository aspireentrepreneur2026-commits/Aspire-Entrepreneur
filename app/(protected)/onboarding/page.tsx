import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";
import { getRoleDashboardPath } from "@/lib/auth-redirect";
import { OnboardingForms } from "@/components/onboarding/onboarding-forms";

export default async function OnboardingPage() {
  const session = await requireAuth();
  const role = session.user.role;
  const onboardingStatus = session.user.onboardingStatus;

  if (!role) {
    redirect("/login");
  }

  if (onboardingStatus === "COMPLETED") {
    redirect(getRoleDashboardPath(role));
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="mb-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">
        <p className="text-xs uppercase tracking-wide text-indigo-600">Role onboarding</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Complete your {role.toLowerCase()} profile
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This takes under 2 minutes and helps personalize your dashboard and matches.
        </p>
      </div>

      <OnboardingForms role={role} />
    </main>
  );
}
