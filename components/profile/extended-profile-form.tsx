"use client";

import { useActionState } from "react";
import { saveExtendedProfileAction, type ExtendedProfileState } from "@/app/actions/extended-profile";

type Role = "FOUNDER" | "MENTOR" | "INVESTOR";

const initial: ExtendedProfileState | undefined = undefined;

const hints: Record<
  Role,
  { investmentCapital: string; investmentInterest: string; investmentHistory: string }
> = {
  FOUNDER: {
    investmentCapital: "Capital you have raised, are raising, or key runway context.",
    investmentInterest: "Types of investors or partners you want to meet.",
    investmentHistory: "Past funding rounds, SAFEs, grants, or notable financial milestones.",
  },
  MENTOR: {
    investmentCapital: "Optional — if you also deploy capital as an angel or LP, describe scope.",
    investmentInterest: "Optional — sectors or stages you personally invest in, if any.",
    investmentHistory: "Optional — write “N/A” if you do not invest; otherwise brief history.",
  },
  INVESTOR: {
    investmentCapital: "Typical cheque size, fund size, or deployable capital (as you can share).",
    investmentInterest: "Themes, sectors, geographies, and stage you actively pursue.",
    investmentHistory: "Notable portfolio companies, exits, or prior investment experience.",
  },
};

type Defaults = {
  industryExpertiseNarrative: string | null;
  studyWorkBackground: string | null;
  achievements: string | null;
  investmentCapital: string | null;
  investmentInterest: string | null;
  investmentHistory: string | null;
};

export function ExtendedProfileForm({ role, defaults }: { role: Role; defaults: Defaults }) {
  const [state, action, pending] = useActionState(saveExtendedProfileAction, initial);
  const h = hints[role];

  return (
    <form action={action} className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
        <p>
          All six sections are <strong>required</strong> (minimum 10 characters each). This unlocks your full
          professional card for other members and clears the dashboard reminder.
        </p>
      </div>

      <Field
        id="industryExpertiseNarrative"
        label="Industry expertise"
        sub="Deep expertise areas, sectors, and how you add value beyond your headline startup/domain line."
        defaultValue={defaults.industryExpertiseNarrative}
      />
      <Field
        id="studyWorkBackground"
        label="Study & work background"
        sub="Education, employers, and career path relevant to how you build, mentor, or invest."
        defaultValue={defaults.studyWorkBackground}
      />
      <Field
        id="achievements"
        label="Achievements"
        sub="Awards, revenue milestones, exits, publications, community impact — what you’re proud of."
        defaultValue={defaults.achievements}
      />
      <Field
        id="investmentCapital"
        label="Investment capital"
        sub={h.investmentCapital}
        defaultValue={defaults.investmentCapital}
      />
      <Field
        id="investmentInterest"
        label="Investment interest"
        sub={h.investmentInterest}
        defaultValue={defaults.investmentInterest}
      />
      <Field
        id="investmentHistory"
        label="Investment history"
        sub={h.investmentHistory}
        defaultValue={defaults.investmentHistory}
      />

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-700">{state.success}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#0a66c2] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#004182] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save professional profile"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  sub,
  defaultValue,
}: {
  id: string;
  label: string;
  sub: string;
  defaultValue: string | null;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-semibold text-slate-900">
        {label}
      </label>
      <p className="text-xs text-slate-500">{sub}</p>
      <textarea
        id={id}
        name={id}
        required
        minLength={10}
        rows={4}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#0a66c2] focus:ring-2 focus:ring-[#0a66c2]/20"
      />
    </div>
  );
}
