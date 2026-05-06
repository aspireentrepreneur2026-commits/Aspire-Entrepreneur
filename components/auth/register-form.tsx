"use client";

import { useActionState, useState } from "react";
import { registerAction } from "@/app/actions/auth";

const initialState = undefined;

export function RegisterForm() {
  const [role, setRole] = useState<"FOUNDER" | "MENTOR" | "INVESTOR">("FOUNDER");
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="text-sm text-slate-600">Join the platform and pick your role to get started.</p>

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="confirmEmail" className="text-sm font-medium text-slate-700">
          Confirm email
        </label>
        <input
          id="confirmEmail"
          name="confirmEmail"
          type="email"
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">
          Phone number (WhatsApp preferred)
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          required
          placeholder="+923001234567"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="confirmPhoneNumber" className="text-sm font-medium text-slate-700">
          Confirm phone number
        </label>
        <input
          id="confirmPhoneNumber"
          name="confirmPhoneNumber"
          required
          placeholder="+923001234567"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="grid gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="emailCode" className="text-sm font-medium text-slate-700">
            Email verification code
          </label>
          <input
            id="emailCode"
            name="emailCode"
            required
            minLength={6}
            maxLength={6}
            placeholder="123456"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phoneCode" className="text-sm font-medium text-slate-700">
            Phone/WhatsApp verification code
          </label>
          <input
            id="phoneCode"
            name="phoneCode"
            required
            minLength={6}
            maxLength={6}
            placeholder="654321"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>
        <p className="text-xs text-slate-600 md:col-span-2">
          First submit sends verification codes. Submit again with both codes to complete account creation.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="country" className="text-sm font-medium text-slate-700">
            Country
          </label>
          <input
            id="country"
            name="country"
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="location" className="text-sm font-medium text-slate-700">
            City / Location
          </label>
          <input
            id="location"
            name="location"
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="experienceLevel" className="text-sm font-medium text-slate-700">
            Experience level
          </label>
          <input
            id="experienceLevel"
            name="experienceLevel"
            required
            placeholder="Beginner / Intermediate / Expert"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="primaryGoal" className="text-sm font-medium text-slate-700">
            Primary goal
          </label>
          <input
            id="primaryGoal"
            name="primaryGoal"
            required
            placeholder="Raise funding / Find mentor / Invest"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="joinAim" className="text-sm font-medium text-slate-700">
          What is your main aim to join Aspire Entrepreneur portal?
        </label>
        <textarea
          id="joinAim"
          name="joinAim"
          required
          rows={3}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="aboutYourself" className="text-sm font-medium text-slate-700">
          Tell me about yourself
        </label>
        <textarea
          id="aboutYourself"
          name="aboutYourself"
          required
          rows={4}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="linkedinUrl" className="text-sm font-medium text-slate-700">
          LinkedIn URL (optional)
        </label>
        <input
          id="linkedinUrl"
          name="linkedinUrl"
          type="url"
          placeholder="https://www.linkedin.com/in/username"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="role" className="text-sm font-medium text-slate-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          required
          value={role}
          onChange={(event) => setRole(event.target.value as "FOUNDER" | "MENTOR" | "INVESTOR")}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        >
          <option value="FOUNDER">Founder</option>
          <option value="MENTOR">Mentor</option>
          <option value="INVESTOR">Investor</option>
        </select>
      </div>

      {role === "FOUNDER" ? (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Founder profile details</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="startupName" className="text-sm font-medium text-slate-700">
                Startup name
              </label>
              <input
                id="startupName"
                name="startupName"
                required
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="stage" className="text-sm font-medium text-slate-700">
                Stage
              </label>
              <input
                id="stage"
                name="stage"
                required
                placeholder="Idea / MVP / Growth"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="industry" className="text-sm font-medium text-slate-700">
                Industry
              </label>
              <input
                id="industry"
                name="industry"
                required
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="teamSize" className="text-sm font-medium text-slate-700">
                Team size
              </label>
              <input
                id="teamSize"
                name="teamSize"
                placeholder="5-10"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="fundingNeeded" className="text-sm font-medium text-slate-700">
                Funding needed
              </label>
              <input
                id="fundingNeeded"
                name="fundingNeeded"
                placeholder="$20k-$50k"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="traction" className="text-sm font-medium text-slate-700">
                Traction
              </label>
              <input
                id="traction"
                name="traction"
                placeholder="MRR / active users"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      ) : null}

      {role === "MENTOR" ? (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Mentor profile details</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="yearsExperience" className="text-sm font-medium text-slate-700">
                Years of experience
              </label>
              <input
                id="yearsExperience"
                name="yearsExperience"
                type="number"
                min={1}
                required
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="domainExpertise" className="text-sm font-medium text-slate-700">
                Domain expertise
              </label>
              <input
                id="domainExpertise"
                name="domainExpertise"
                required
                placeholder="SaaS, growth, product"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="pastCompanies" className="text-sm font-medium text-slate-700">
                Past companies
              </label>
              <input
                id="pastCompanies"
                name="pastCompanies"
                placeholder="Google, Daraz"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="mentoringStyle" className="text-sm font-medium text-slate-700">
                Mentoring style
              </label>
              <input
                id="mentoringStyle"
                name="mentoringStyle"
                placeholder="Weekly sessions"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="availability" className="text-sm font-medium text-slate-700">
                Availability
              </label>
              <input
                id="availability"
                name="availability"
                placeholder="Weekends, 4h/week"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      ) : null}

      {role === "INVESTOR" ? (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-800">Investor profile details</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="firmName" className="text-sm font-medium text-slate-700">
                Firm / fund name
              </label>
              <input
                id="firmName"
                name="firmName"
                required
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="checkSizeRange" className="text-sm font-medium text-slate-700">
                Check size range
              </label>
              <input
                id="checkSizeRange"
                name="checkSizeRange"
                required
                placeholder="$5k-$100k"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="investmentStage" className="text-sm font-medium text-slate-700">
                Investment stage
              </label>
              <input
                id="investmentStage"
                name="investmentStage"
                required
                placeholder="Pre-seed / Seed"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="sectorsOfInterest" className="text-sm font-medium text-slate-700">
                Sectors of interest
              </label>
              <input
                id="sectorsOfInterest"
                name="sectorsOfInterest"
                required
                placeholder="Fintech, SaaS"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="preferredGeography" className="text-sm font-medium text-slate-700">
                Preferred geography
              </label>
              <input
                id="preferredGeography"
                name="preferredGeography"
                placeholder="Pakistan, GCC"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      ) : null}

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? (
        <p className="text-sm text-green-700">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-indigo-600 px-3 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
