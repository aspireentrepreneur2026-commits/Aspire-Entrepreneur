"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  adminUpdateUserOnboarding,
  adminUpdateUserRole,
  type AdminActionState,
} from "@/app/actions/admin";

type ProfileHint = {
  label: string;
  value: string;
} | null;

export type AdminUserRowModel = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  onboardingStatus: string;
  primaryGoal: string | null;
  joinAim: string | null;
  country: string | null;
  location: string | null;
  createdAt: string;
  founderProfile: {
    startupName: string;
    stage: string;
    industry: string;
    traction: string | null;
  } | null;
  mentorProfile: { domainExpertise: string } | null;
  investorProfile: { firmName: string } | null;
};

function profileHint(user: AdminUserRowModel): ProfileHint {
  if (user.founderProfile) {
    const traction = user.founderProfile.traction ?? "";
    const typeMatch = traction.match(/Type:\s*([^\s|]+)/);
    const type = typeMatch?.[1];
    return {
      label: "Startup / signup focus",
      value: [
        user.founderProfile.startupName,
        type ? `Type: ${type.replace(/_/g, " ")}` : null,
        user.founderProfile.stage,
      ]
        .filter(Boolean)
        .join(" · "),
    };
  }
  if (user.mentorProfile) {
    return { label: "Mentor", value: user.mentorProfile.domainExpertise };
  }
  if (user.investorProfile) {
    return { label: "Investor", value: user.investorProfile.firmName };
  }
  return null;
}

const initialAdminState: AdminActionState | undefined = undefined;

export function AdminUserRow({
  user,
  currentUserId,
}: {
  user: AdminUserRowModel;
  currentUserId: string;
}) {
  const [roleState, roleAction, rolePending] = useActionState(adminUpdateUserRole, initialAdminState);
  const [onboardingState, onboardingAction, onboardingPending] = useActionState(
    adminUpdateUserOnboarding,
    initialAdminState,
  );

  const hint = profileHint(user);
  const feedback =
    roleState?.error ||
    onboardingState?.error ||
    roleState?.success ||
    onboardingState?.success;
  const feedbackIsError = !!(roleState?.error || onboardingState?.error);

  return (
    <tr className="border-b border-slate-100 align-top text-sm text-slate-700">
      <td className="px-3 py-3">
        <Link
          href={`/dashboard/admin/users/${user.id}`}
          className="font-medium text-indigo-700 underline-offset-2 hover:underline"
        >
          {user.name}
        </Link>
        <p className="text-xs text-slate-500">{user.email}</p>
        {user.phoneNumber ? <p className="text-xs text-slate-500">{user.phoneNumber}</p> : null}
      </td>
      <td className="hidden px-3 py-3 md:table-cell">
        {hint ? (
          <>
            <p className="text-xs font-medium text-slate-500">{hint.label}</p>
            <p className="line-clamp-2 text-slate-700">{hint.value}</p>
          </>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>
      <td className="px-3 py-3">
        <form action={roleAction} className="space-y-1">
          <input type="hidden" name="userId" value={user.id} />
          <select
            name="role"
            defaultValue={user.role}
            disabled={rolePending}
            className="w-full max-w-[9.5rem] rounded-md border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:border-indigo-500"
          >
            <option value="FOUNDER">Founder</option>
            <option value="MENTOR">Mentor</option>
            <option value="INVESTOR">Investor</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            disabled={rolePending}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
          >
            Save role
          </button>
        </form>
      </td>
      <td className="px-3 py-3">
        <form action={onboardingAction} className="space-y-1">
          <input type="hidden" name="userId" value={user.id} />
          <select
            name="onboardingStatus"
            defaultValue={user.onboardingStatus}
            disabled={onboardingPending}
            className="w-full max-w-[11rem] rounded-md border border-slate-300 bg-white px-2 py-1 text-xs outline-none focus:border-indigo-500"
          >
            <option value="BASIC">Basic</option>
            <option value="ROLE_PROFILE">Role profile</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button
            type="submit"
            disabled={onboardingPending}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
          >
            Save status
          </button>
        </form>
      </td>
      <td className="hidden px-3 py-3 text-xs text-slate-500 lg:table-cell">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-3 py-3 text-xs text-slate-600">
        {feedback ? (
          <span className={feedbackIsError ? "text-red-600" : "text-green-700"}>{feedback}</span>
        ) : user.id === currentUserId ? (
          <span className="text-slate-400">You</span>
        ) : null}
      </td>
    </tr>
  );
}
