"use client";

import { useActionState, useState } from "react";
import { registerAction } from "@/app/actions/auth";
import { useRef } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState = undefined;
type UserType = "ENTREPRENEUR" | "NEW_BUSINESS";

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
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("ENTREPRENEUR");
  const [step, setStep] = useState<1 | 2>(1);
  const [state, action, pending] = useActionState(registerAction, initialState);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!state?.success) return;
    const timer = setTimeout(() => {
      router.push("/login");
    }, 700);
    return () => clearTimeout(timer);
  }, [router, state?.success]);

  const handleNext = () => {
    const form = formRef.current;
    if (!form) return;
    // Uses native browser validation for required inputs in step 1.
    const ok = form.reportValidity();
    if (!ok) return;
    setStep(2);
  };

  const handleBack = () => setStep(1);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <section
        className="space-y-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4 lg:p-5"
        hidden={step !== 1}
      >
        <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-300">
          Aspire Entrepreneur
        </p>
        <h2 className="text-3xl font-semibold leading-tight">
          Join with your profile
        </h2>
        <p className="text-sm text-slate-300">Step 1: Basic details</p>

        <div className="space-y-3 rounded-xl border border-slate-700 bg-[#0f172a] p-3">
          <p className="text-xs font-semibold text-cyan-300">Basic details</p>
          <Input id="name" name="name" label="Full name" required />
          <Input id="email" name="email" label="Email" type="email" required />
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            required
          />
          <Input
            id="phoneNumber"
            name="phoneNumber"
            label="Phone number"
            required
            placeholder="+923001234567"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Input id="location" name="location" label="Location" required />
            <Input id="zipCode" name="zipCode" label="Zip code" required />
          </div>
          <Input id="country" name="country" label="Country" required />

          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-300">
              How are you? (required)
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="radio"
                  name="userType"
                  value="ENTREPRENEUR"
                  required
                  checked={userType === "ENTREPRENEUR"}
                  onChange={() => setUserType("ENTREPRENEUR")}
                />
                Entrepreneur
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="radio"
                  name="userType"
                  value="NEW_BUSINESS"
                  checked={userType === "NEW_BUSINESS"}
                  onChange={() => setUserType("NEW_BUSINESS")}
                />
                New business
              </label>
            </div>
          </div>
        </div>
      </section>

      {step === 2 ? (
        <section className="space-y-3 rounded-xl bg-slate-900/60 p-4 lg:p-5">
          <p className="text-xs font-semibold text-indigo-300">
            Step 2:{" "}
            {userType === "ENTREPRENEUR" ? "Entrepreneur" : "New business"}{" "}
            details
          </p>
          {userType === "NEW_BUSINESS" ? (
            <div className="space-y-2 rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-3">
              <p className="text-sm font-semibold text-emerald-300">
                New business-specific details
              </p>
              <div className="space-y-1">
                <label
                  htmlFor="newBusinessCategory"
                  className="text-sm font-medium text-slate-300"
                >
                  Select new business/startup type (required)
                </label>
                <select
                  id="newBusinessCategory"
                  name="newBusinessCategory"
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option value="">Choose one</option>
                  <option value="TECH_STARTUP">Tech startup</option>
                  <option value="SMALL_BUSINESS">Small business</option>
                  <option value="ECOMMERCE_BRAND">E-commerce brand</option>
                  <option value="SERVICE_BUSINESS">Service business</option>
                  <option value="SOCIAL_ENTERPRISE">Social enterprise</option>
                  <option value="IDEA_TO_MVP">Idea to MVP</option>
                  <option value="EARLY_STAGE_STARTUP">
                    Early-stage startup
                  </option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  id="businessName"
                  name="businessName"
                  label="Business name"
                  required
                />
                <Input
                  id="businessModel"
                  name="businessModel"
                  label="Business model"
                  required
                />
                <Input
                  id="targetMarket"
                  name="targetMarket"
                  label="Target market"
                  required
                />
                <Input
                  id="launchTimeline"
                  name="launchTimeline"
                  label="Launch timeline"
                  required
                />
                <Input
                  id="teamBackground"
                  name="teamBackground"
                  label="Team background"
                />
                <Input
                  id="initialBudget"
                  name="initialBudget"
                  label="Initial budget"
                />
              </div>
            </div>
          ) : null}

          <Input
            id="linkedinUrl"
            name="linkedinUrl"
            label="LinkedIn URL"
            type="url"
            required={true}
            placeholder="https://www.linkedin.com/in/username"
          />

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
              placeholder="Launch / Grow / Raise funding"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="joinAim"
              className="text-sm font-medium text-slate-300"
            >
              Reason for joining
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
            <label
              htmlFor="aboutYourself"
              className="text-sm font-medium text-slate-300"
            >
              About yourself
            </label>
            <textarea
              id="aboutYourself"
              name="aboutYourself"
              required
              rows={4}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          {userType === "ENTREPRENEUR" ? (
            <div className="space-y-2 rounded-lg border border-cyan-900/50 bg-cyan-950/20 p-3">
              <p className="text-sm font-semibold text-cyan-300">
                Entrepreneur-specific details
              </p>
              <div className="space-y-1">
                <label
                  htmlFor="entrepreneurCategory"
                  className="text-sm font-medium text-slate-300"
                >
                  Select your entrepreneur type (required)
                </label>
                <select
                  id="entrepreneurCategory"
                  name="entrepreneurCategory"
                  required
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option value="">Choose one</option>
                  <option value="FOUNDER">Founder</option>
                  <option value="COMPANY_FOUNDER">Company founder</option>
                  <option value="BUSINESS_OWNER">Business owner</option>
                  <option value="ENTREPRENEUR">Entrepreneur</option>
                  <option value="INVESTOR_ENTREPRENEUR">
                    Investor entrepreneur
                  </option>
                  <option value="CO_FOUNDER">Co-founder</option>
                  <option value="SOLO_PRENEUR">Solopreneur</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  id="startupName"
                  name="startupName"
                  label="Startup name"
                  required
                />
                <Input
                  id="stage"
                  name="stage"
                  label="Stage"
                  required
                  placeholder="Idea/MVP/Growth"
                />
                <Input
                  id="industry"
                  name="industry"
                  label="Industry"
                  required
                />
                <Input id="teamSize" name="teamSize" label="Team size" />
                <Input
                  id="fundingNeeded"
                  name="fundingNeeded"
                  label="Funding needed"
                />
                <Input id="traction" name="traction" label="Traction" />
              </div>
            </div>
          ) : null}

          {state?.error ? (
            <p className="text-sm text-red-400">{state.error}</p>
          ) : null}
          {state?.success ? (
            <p className="text-sm text-emerald-400">{state.success}</p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleBack}
              disabled={pending}
              className="w-full rounded-md border border-slate-500 bg-transparent px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-cyan-600 px-3 py-2 font-medium text-white hover:bg-cyan-700 disabled:opacity-60 sm:flex-1"
            >
              {pending ? "Creating account..." : "Create account"}
            </button>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded-md bg-cyan-600 px-3 py-2 font-medium text-white hover:bg-cyan-700"
        >
          Next
        </button>
      ) : null}
    </form>
  );
}
