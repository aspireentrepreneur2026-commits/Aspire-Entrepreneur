"use client";

import { useActionState } from "react";
import {
  adminUpdateUserOnboarding,
  adminUpdateUserRole,
  type AdminActionState,
} from "@/app/actions/admin";
import type { AdminUserRowModel } from "@/components/admin/admin-user-row";

const initialAdminState: AdminActionState | undefined = undefined;

export function AdminUserDetailForms({
  model,
  currentUserId,
}: {
  model: AdminUserRowModel;
  currentUserId: string;
}) {
  const [roleState, roleAction, rolePending] = useActionState(adminUpdateUserRole, initialAdminState);
  const [onboardingState, onboardingAction, onboardingPending] = useActionState(
    adminUpdateUserOnboarding,
    initialAdminState,
  );

  const feedback =
    roleState?.error ||
    onboardingState?.error ||
    roleState?.success ||
    onboardingState?.success;
  const feedbackIsError = !!(roleState?.error || onboardingState?.error);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <form action={roleAction} className="flex-1 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <input type="hidden" name="userId" value={model.id} />
          <label htmlFor={`role-${model.id}`} className="text-sm font-medium text-slate-700">
            Platform role
          </label>
          <select
            id={`role-${model.id}`}
            name="role"
            defaultValue={model.role}
            disabled={rolePending}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            <option value="FOUNDER">Founder</option>
            <option value="MENTOR">Mentor</option>
            <option value="INVESTOR">Investor</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            disabled={rolePending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {rolePending ? "Saving…" : "Update role"}
          </button>
        </form>

        <form action={onboardingAction} className="flex-1 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <input type="hidden" name="userId" value={model.id} />
          <label htmlFor={`onboarding-${model.id}`} className="text-sm font-medium text-slate-700">
            Onboarding status
          </label>
          <select
            id={`onboarding-${model.id}`}
            name="onboardingStatus"
            defaultValue={model.onboardingStatus}
            disabled={onboardingPending}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            <option value="BASIC">Basic</option>
            <option value="ROLE_PROFILE">Role profile</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button
            type="submit"
            disabled={onboardingPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {onboardingPending ? "Saving…" : "Update status"}
          </button>
        </form>
      </div>

      {feedback ? (
        <p className={`text-sm ${feedbackIsError ? "text-red-600" : "text-green-700"}`}>{feedback}</p>
      ) : model.id === currentUserId ? (
        <p className="text-sm text-slate-500">This is your admin account.</p>
      ) : null}
    </div>
  );
}
