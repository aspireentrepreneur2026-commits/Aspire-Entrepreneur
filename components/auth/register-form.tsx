"use client";

import { useActionState, useState } from "react";
import { registerAction } from "@/app/actions/auth";

const initialState = undefined;
type Role = "FOUNDER" | "MENTOR" | "INVESTOR";

function Input({
  id,
  name,
  label,
  type = "text",
  required = false,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
      />
    </div>
  );
}

export function RegisterForm() {
  const [role, setRole] = useState<Role>("FOUNDER");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="space-y-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4 lg:p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-300">Aspire Entrepreneur</p>
          <h2 className="text-3xl font-semibold leading-tight">
            Build a professional profile and join a serious startup network.
          </h2>
          <p className="text-sm text-slate-300">
            Founders, mentors, and investors each get a dedicated role-based workspace.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2 text-xs text-slate-200">
              Founder opportunities
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2 text-xs text-slate-200">
              Mentor network
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2 text-xs text-slate-200">
              Investor pipeline
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 p-2 text-xs text-slate-200">
              Trusted verification
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-700 bg-[#0f172a] p-3">
            <p className="text-xs font-semibold text-cyan-300">Column 1 - Identity & Verification</p>
            <Input id="name" name="name" label="Full name" required />
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  name="intent"
                  value="verifyEmail"
                  formNoValidate
                  className="mt-1 text-xs text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                >
                  Verify email
                </button>
              </div>
              <div className="space-y-1">
                <label htmlFor="emailCode" className="text-sm font-medium text-slate-300">
                  Email code
                </label>
                <input
                  id="emailCode"
                  name="emailCode"
                  required
                  minLength={6}
                  maxLength={6}
                  placeholder="123456"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-slate-300">
                  Phone number (WhatsApp preferred)
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="+923001234567"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  name="intent"
                  value="verifyPhone"
                  formNoValidate
                  className="mt-1 text-xs text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
                >
                  Verify phone number
                </button>
              </div>
              <div className="space-y-1">
                <label htmlFor="phoneCode" className="text-sm font-medium text-slate-300">
                  Phone/WhatsApp code
                </label>
                <input
                  id="phoneCode"
                  name="phoneCode"
                  required
                  minLength={6}
                  maxLength={6}
                  placeholder="654321"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input id="country" name="country" label="Country" required />
              <Input id="location" name="location" label="Location" required />
            </div>
            <Input id="password" name="password" label="Password" type="password" required />
            <div className="space-y-1">
              <label htmlFor="role" className="text-sm font-medium text-slate-300">
                Role
              </label>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={(event) => setRole(event.target.value as Role)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
              >
                <option value="FOUNDER">Founder</option>
                <option value="MENTOR">Mentor</option>
                <option value="INVESTOR">Investor</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4 lg:p-5">
          <p className="text-xs font-semibold text-indigo-300">Column 2 - Profile Details</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              id="experienceLevel"
              name="experienceLevel"
              label="Experience level"
              required
              placeholder="Beginner / Intermediate / Expert"
            />
            <Input
              id="primaryGoal"
              name="primaryGoal"
              label="Primary goal"
              required
              placeholder="Raise funding / Find mentor / Invest"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="joinAim" className="text-sm font-medium text-slate-300">
              Main aim to join Aspire Entrepreneur portal
            </label>
            <textarea
              id="joinAim"
              name="joinAim"
              required
              rows={3}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="aboutYourself" className="text-sm font-medium text-slate-300">
              Tell me about yourself
            </label>
            <textarea
              id="aboutYourself"
              name="aboutYourself"
              required
              rows={4}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            label="LinkedIn URL (optional)"
            type="url"
            placeholder="https://www.linkedin.com/in/username"
          />

          {role === "FOUNDER" ? (
            <div className="space-y-2 rounded-lg border border-cyan-900/50 bg-cyan-950/20 p-3">
              <p className="text-sm font-semibold text-cyan-300">Founder fields</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input id="startupName" name="startupName" label="Startup name" required />
                <Input id="stage" name="stage" label="Stage" required placeholder="Idea/MVP/Growth" />
                <Input id="industry" name="industry" label="Industry" required />
                <Input id="teamSize" name="teamSize" label="Team size" />
                <Input id="fundingNeeded" name="fundingNeeded" label="Funding needed" />
                <Input id="traction" name="traction" label="Traction" />
              </div>
            </div>
          ) : null}

          {role === "MENTOR" ? (
            <div className="space-y-2 rounded-lg border border-violet-900/50 bg-violet-950/20 p-3">
              <p className="text-sm font-semibold text-violet-300">Mentor fields</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  id="yearsExperience"
                  name="yearsExperience"
                  label="Years of experience"
                  type="number"
                  required
                />
                <Input id="domainExpertise" name="domainExpertise" label="Domain expertise" required />
                <Input id="pastCompanies" name="pastCompanies" label="Past companies" />
                <Input id="mentoringStyle" name="mentoringStyle" label="Mentoring style" />
                <div className="sm:col-span-2">
                  <Input id="availability" name="availability" label="Availability" />
                </div>
              </div>
            </div>
          ) : null}

          {role === "INVESTOR" ? (
            <div className="space-y-2 rounded-lg border border-fuchsia-900/50 bg-fuchsia-950/20 p-3">
              <p className="text-sm font-semibold text-fuchsia-300">Investor fields</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input id="firmName" name="firmName" label="Firm / fund name" required />
                <Input id="checkSizeRange" name="checkSizeRange" label="Check size range" required />
                <Input id="investmentStage" name="investmentStage" label="Investment stage" required />
                <Input id="sectorsOfInterest" name="sectorsOfInterest" label="Sectors of interest" required />
                <div className="sm:col-span-2">
                  <Input id="preferredGeography" name="preferredGeography" label="Preferred geography" />
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <p className="text-xs text-slate-400">
        Use the verify links to receive codes first, then enter both codes and click Create account.
      </p>
      {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-emerald-400">{state.success}</p> : null}

      <button
        type="submit"
        name="intent"
        value="createAccount"
        disabled={pending}
        className="w-full rounded-md bg-cyan-600 px-3 py-2 font-medium text-white hover:bg-cyan-700 disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
