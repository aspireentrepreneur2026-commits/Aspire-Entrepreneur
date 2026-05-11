"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/auth";

type Role = "FOUNDER" | "MENTOR" | "INVESTOR" | "ADMIN";

type Props = {
  user: {
    name: string;
    role: Role;
    image?: string | null;
    coverImageUrl?: string | null;
    profileApprovalStatus?: string;
    profileApprovalNote?: string | null;
    phoneNumber: string | null;
    country: string | null;
    location: string | null;
    joinAim: string | null;
    aboutYourself: string | null;
    experienceLevel: string | null;
    primaryGoal: string | null;
    linkedinUrl: string | null;
    founderProfile: {
      startupName: string;
      stage: string;
      industry: string;
      teamSize: string | null;
      traction: string | null;
      fundingNeeded: string | null;
    } | null;
    mentorProfile: {
      yearsExperience: number;
      domainExpertise: string;
      pastCompanies: string | null;
      mentoringStyle: string | null;
      availability: string | null;
    } | null;
    investorProfile: {
      firmName: string;
      checkSizeRange: string;
      investmentStage: string;
      sectorsOfInterest: string;
      preferredGeography: string | null;
    } | null;
  };
};

const initialState = undefined;

function Field({
  id,
  label,
  defaultValue,
  required = false,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
      />
    </div>
  );
}

export function UpdateProfileForm({ user }: Props) {
  const [state, action, pending] = useActionState(updateProfileAction, initialState);
  const role = user.role;

  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
    >
      <h2 className="text-xl font-semibold text-slate-900">Profile settings</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Field id="name" label="Display name" defaultValue={user.name} required />
        <Field id="phoneNumber" label="Phone number" defaultValue={user.phoneNumber} required />
        <Field id="country" label="Country" defaultValue={user.country} required />
        <Field id="location" label="Location" defaultValue={user.location} required />
        <Field id="experienceLevel" label="Experience level" defaultValue={user.experienceLevel} required />
        <Field id="primaryGoal" label="Primary goal" defaultValue={user.primaryGoal} required />
        <Field
          id="linkedinUrl"
          label="LinkedIn URL"
          defaultValue={user.linkedinUrl}
          required
          placeholder="https://..."
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="joinAim" className="text-sm font-medium text-slate-700">
          Main aim to join Aspire Entrepreneur
        </label>
        <textarea
          id="joinAim"
          name="joinAim"
          required
          defaultValue={user.joinAim ?? ""}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
          rows={3}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="aboutYourself" className="text-sm font-medium text-slate-700">
          Tell us about yourself
        </label>
        <textarea
          id="aboutYourself"
          name="aboutYourself"
          required
          defaultValue={user.aboutYourself ?? ""}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
          rows={4}
        />
      </div>

      {role === "FOUNDER" ? (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Founder details</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="startupName" label="Startup name" defaultValue={user.founderProfile?.startupName} required />
            <Field id="stage" label="Stage" defaultValue={user.founderProfile?.stage} required />
            <Field id="industry" label="Industry" defaultValue={user.founderProfile?.industry} required />
            <Field id="teamSize" label="Team size" defaultValue={user.founderProfile?.teamSize} />
            <Field id="fundingNeeded" label="Funding needed" defaultValue={user.founderProfile?.fundingNeeded} />
            <Field id="traction" label="Traction" defaultValue={user.founderProfile?.traction} />
          </div>
        </div>
      ) : null}

      {role === "MENTOR" ? (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Mentor details</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              id="yearsExperience"
              type="number"
              label="Years experience"
              defaultValue={user.mentorProfile?.yearsExperience}
              required
            />
            <Field
              id="domainExpertise"
              label="Domain expertise"
              defaultValue={user.mentorProfile?.domainExpertise}
              required
            />
            <Field id="pastCompanies" label="Past companies" defaultValue={user.mentorProfile?.pastCompanies} />
            <Field id="mentoringStyle" label="Mentoring style" defaultValue={user.mentorProfile?.mentoringStyle} />
            <Field id="availability" label="Availability" defaultValue={user.mentorProfile?.availability} />
          </div>
        </div>
      ) : null}

      {role === "INVESTOR" ? (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Investor details</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field id="firmName" label="Firm name" defaultValue={user.investorProfile?.firmName} required />
            <Field
              id="checkSizeRange"
              label="Check size range"
              defaultValue={user.investorProfile?.checkSizeRange}
              required
            />
            <Field
              id="investmentStage"
              label="Investment stage"
              defaultValue={user.investorProfile?.investmentStage}
              required
            />
            <Field
              id="sectorsOfInterest"
              label="Sectors of interest"
              defaultValue={user.investorProfile?.sectorsOfInterest}
              required
            />
            <Field
              id="preferredGeography"
              label="Preferred geography"
              defaultValue={user.investorProfile?.preferredGeography}
            />
          </div>
        </div>
      ) : null}

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-700">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
