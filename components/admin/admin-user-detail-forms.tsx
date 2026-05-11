"use client";

import { useActionState } from "react";
import {
  adminUpdateProfileApproval,
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
  const [profileState, profileAction, profilePending] = useActionState(
    adminUpdateProfileApproval,
    initialAdminState,
  );

  const feedback =
    roleState?.error ||
    onboardingState?.error ||
    profileState?.error ||
    roleState?.success ||
    onboardingState?.success ||
    profileState?.success;
  const feedbackIsError = !!(roleState?.error || onboardingState?.error || profileState?.error);

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

      <form action={profileAction} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <input type="hidden" name="userId" value={model.id} />
        <p className="text-sm font-medium text-slate-700">Member profile visibility</p>
        <p className="text-xs text-slate-500">
          Approved profiles show name, goal, about, and photos to other signed-in members. Rejected hides the card
          from non-admins.
        </p>
        <label htmlFor={`profile-status-${model.id}`} className="block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id={`profile-status-${model.id}`}
          name="status"
          defaultValue={model.profileApprovalStatus ?? "APPROVED"}
          disabled={profilePending}
          className="w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
        >
          <option value="APPROVED">Approved — visible to members</option>
          <option value="PENDING">Pending — limited visibility</option>
          <option value="REJECTED">Rejected — hidden from members</option>
        </select>
        <label htmlFor={`profile-note-${model.id}`} className="block text-sm font-medium text-slate-700">
          Note (optional, shown to admins / stored when rejected)
        </label>
        <textarea
          id={`profile-note-${model.id}`}
          name="note"
          rows={2}
          defaultValue={model.profileApprovalNote ?? ""}
          placeholder="Reason for rejection or internal note…"
          className="w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={profilePending}
          className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
        >
          {profilePending ? "Saving…" : "Save profile visibility"}
        </button>
      </form>

      {feedback ? (
        <p className={`text-sm ${feedbackIsError ? "text-red-600" : "text-green-700"}`}>{feedback}</p>
      ) : model.id === currentUserId ? (
        <p className="text-sm text-slate-500">This is your admin account.</p>
      ) : null}
    </div>
  );
}
