"use client";

import { useActionState } from "react";
import {
  completeFounderOnboarding,
  completeInvestorOnboarding,
  completeMentorOnboarding,
  type OnboardingActionState,
} from "@/app/actions/onboarding";

type AppRole = "FOUNDER" | "MENTOR" | "INVESTOR" | "ADMIN";

type Props = {
  role: AppRole;
};

const initialState = undefined as OnboardingActionState | undefined;

function Input({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
      />
    </div>
  );
}

export function OnboardingForms({ role }: Props) {
  const [founderState, founderAction, founderPending] = useActionState(
    completeFounderOnboarding,
    initialState,
  );
  const [mentorState, mentorAction, mentorPending] = useActionState(
    completeMentorOnboarding,
    initialState,
  );
  const [investorState, investorAction, investorPending] = useActionState(
    completeInvestorOnboarding,
    initialState,
  );

  if (role === "FOUNDER") {
    return (
      <form
        action={founderAction}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]"
      >
        <Input name="startupName" label="Startup name" required />
        <Input name="stage" label="Stage (Idea/MVP/Growth)" required />
        <Input name="industry" label="Industry" required />
        <Input name="teamSize" label="Team size (optional)" />
        <Input name="fundingNeeded" label="Funding needed (optional)" />
        {founderState?.error ? <p className="text-sm text-red-600">{founderState.error}</p> : null}
        <button
          type="submit"
          disabled={founderPending}
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {founderPending ? "Saving..." : "Complete onboarding"}
        </button>
      </form>
    );
  }

  if (role === "MENTOR") {
    return (
      <form
        action={mentorAction}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]"
      >
        <Input
          name="yearsExperience"
          type="number"
          label="Years of experience"
          required
          placeholder="5"
        />
        <Input name="domainExpertise" label="Domain expertise" required placeholder="SaaS, Growth, Sales" />
        <Input name="pastCompanies" label="Past companies (optional)" />
        <Input name="availability" label="Availability (optional)" placeholder="Weekends, 4h/week" />
        {mentorState?.error ? <p className="text-sm text-red-600">{mentorState.error}</p> : null}
        <button
          type="submit"
          disabled={mentorPending}
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {mentorPending ? "Saving..." : "Complete onboarding"}
        </button>
      </form>
    );
  }

  if (role === "INVESTOR") {
    return (
      <form
        action={investorAction}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.06)]"
      >
        <Input name="firmName" label="Firm / fund name" required />
        <Input name="checkSizeRange" label="Check size range" required placeholder="$5k - $100k" />
        <Input name="investmentStage" label="Investment stage" required placeholder="Seed, Pre-Seed" />
        <Input name="sectorsOfInterest" label="Sectors of interest" required placeholder="Fintech, SaaS" />
        <Input name="preferredGeography" label="Preferred geography (optional)" />
        {investorState?.error ? <p className="text-sm text-red-600">{investorState.error}</p> : null}
        <button
          type="submit"
          disabled={investorPending}
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {investorPending ? "Saving..." : "Complete onboarding"}
        </button>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-700">Admin onboarding is managed by system administrators.</p>
    </div>
  );
}
