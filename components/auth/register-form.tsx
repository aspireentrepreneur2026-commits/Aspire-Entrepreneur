"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions/auth";
import type { RegistrationPath } from "@/lib/registration-config";
import {
  ENTREPRENEUR_TRACK_FIELDS,
  ENTREPRENEUR_TRACK_LABELS,
  FOUNDER_TRACK_FIELDS,
  FOUNDER_TRACK_LABELS,
  type EntrepreneurTrack,
  type FounderTrack,
} from "@/lib/registration-config";

const initialState = undefined;

/** Shared focus styles for primary / ghost controls (keyboard). */
const focusPrimary =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";
const focusGhost =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const IDEA_FIELDS = FOUNDER_TRACK_FIELDS.IDEA_STAGE;
const STARTUP_FIELDS = FOUNDER_TRACK_FIELDS.EARLY_STARTUP;

/** Mentor, investor, entrepreneur, founder — each with its own follow-up fields. */
const ROLE_OPTIONS: { value: RegistrationPath; title: string; description: string }[] = [
  {
    value: "MENTOR",
    title: "Mentor",
    description: "Guide founders and teams with your experience.",
  },
  {
    value: "INVESTOR",
    title: "Investor",
    description: "Deploy capital and partner with aligned builders.",
  },
  {
    value: "ENTREPRENEUR",
    title: "Entrepreneur",
    description: "Building ventures — then choose a track (new beginner, new startup, solopreneur, etc.).",
  },
  {
    value: "FOUNDER",
    title: "Founder",
    description: "Leading a company — choose a founder track (early startup, growth, nonprofit, etc.).",
  },
];

/** Separate venture entry — different questions from the role row above. */
const VENTURE_OPTIONS: { value: RegistrationPath; title: string; description: string }[] = [
  {
    value: "NEW_BUSINESS",
    title: "New business",
    description: "Registering a concrete business with model, market, and timeline.",
  },
  {
    value: "STARTUP",
    title: "Startup",
    description: "Early-stage company — product, milestones, and runway.",
  },
  {
    value: "NEW_IDEA",
    title: "New idea",
    description: "Validating a concept before you treat it as a full startup.",
  },
];

const ROLE_PATH_VALUES = ROLE_OPTIONS.map((o) => o.value);
const VENTURE_PATH_VALUES = VENTURE_OPTIONS.map((o) => o.value);

/** Top of step 2: people & roles vs venture-led signup (mutually exclusive). */
type Step2JoinCategory = "" | "PEOPLE" | "VENTURES";

function registrationPathMatchesJoin(path: RegistrationPath | "", join: Step2JoinCategory): boolean {
  if (!path || !join) return false;
  if (join === "PEOPLE") return ROLE_PATH_VALUES.includes(path);
  return VENTURE_PATH_VALUES.includes(path);
}

function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  rows,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  const base =
    "w-full rounded-lg border border-slate-600/80 bg-slate-950/80 px-3 py-2.5 text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-200">
        {label}
        {required ? <span className="text-cyan-400"> *</span> : null}
      </label>
      {rows ? (
        <textarea id={id} name={name} required={required} placeholder={placeholder} rows={rows} className={base} />
      ) : (
        <input id={id} name={name} type={type} required={required} placeholder={placeholder} className={base} />
      )}
    </div>
  );
}

function validateWithin(container: HTMLElement | null): boolean {
  if (!container) return false;
  const controls = container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    "input:not([type=hidden]), textarea, select",
  );
  for (const el of controls) {
    if (!el.willValidate) continue;
    if (!el.checkValidity()) {
      el.reportValidity();
      return false;
    }
  }
  return true;
}

function PathCard({
  option,
  checked,
  onSelect,
}: {
  option: { value: RegistrationPath; title: string; description: string };
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition sm:items-center focus-within:ring-2 focus-within:ring-cyan-500/35 focus-within:ring-offset-2 focus-within:ring-offset-slate-950 ${
        checked
          ? "border-cyan-500 bg-cyan-950/25 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
          : "border-slate-600/70 bg-slate-900/40 hover:border-slate-500"
      }`}
    >
      <input
        type="radio"
        name="registrationPath"
        value={option.value}
        checked={checked}
        onChange={onSelect}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-500 accent-cyan-500 sm:mt-0 focus-visible:outline-none"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-white">{option.title}</span>
        <span className="mt-0.5 block text-xs leading-snug text-slate-400">{option.description}</span>
      </span>
    </label>
  );
}

function JoinModeCard({
  title,
  description,
  selected,
  onSelect,
}: {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition sm:items-center ${focusPrimary} ${
        selected
          ? "border-cyan-500 bg-cyan-950/25 shadow-[0_0_0_1px_rgba(34,211,238,0.35)]"
          : "border-slate-600/70 bg-slate-900/40 hover:border-slate-500"
      }`}
    >
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 sm:mt-0 ${
          selected ? "border-cyan-400 bg-cyan-500" : "border-slate-500 bg-slate-950"
        }`}
        aria-hidden
      >
        {selected ? <span className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-xs leading-snug text-slate-400">{description}</span>
      </span>
    </button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [joinCategory, setJoinCategory] = useState<Step2JoinCategory>("");
  const [registrationPath, setRegistrationPath] = useState<RegistrationPath | "">("");
  const [entrepreneurTrack, setEntrepreneurTrack] = useState<EntrepreneurTrack | "">("");
  const [founderTrack, setFounderTrack] = useState<FounderTrack | "">("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [state, action, pending] = useActionState(registerAction, initialState);
  const step1Ref = useRef<HTMLElement | null>(null);
  const step2Ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!state?.success) return;
    const timer = setTimeout(() => {
      router.push("/login");
    }, 700);
    return () => clearTimeout(timer);
  }, [router, state?.success]);

  const handleNextFromStep1 = () => {
    if (!validateWithin(step1Ref.current)) return;
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!joinCategory) return;
    if (!registrationPath || !registrationPathMatchesJoin(registrationPath, joinCategory)) return;
    if (registrationPath === "ENTREPRENEUR" && !entrepreneurTrack) return;
    if (registrationPath === "FOUNDER" && !founderTrack) return;
    if (!validateWithin(step2Ref.current)) return;
    setStep(3);
  };

  const selectJoinCategory = (cat: Step2JoinCategory) => {
    setJoinCategory(cat);
    setRegistrationPath("");
    setEntrepreneurTrack("");
    setFounderTrack("");
  };

  const entrepreneurDefs = entrepreneurTrack ? ENTREPRENEUR_TRACK_FIELDS[entrepreneurTrack] : [];
  const founderDefs = founderTrack ? FOUNDER_TRACK_FIELDS[founderTrack] : [];

  const needsVentureBasics =
    registrationPath === "ENTREPRENEUR" ||
    registrationPath === "FOUNDER" ||
    registrationPath === "NEW_BUSINESS" ||
    registrationPath === "STARTUP" ||
    registrationPath === "NEW_IDEA";

  const pathOkForStep =
    Boolean(joinCategory) &&
    Boolean(registrationPath) &&
    registrationPathMatchesJoin(registrationPath, joinCategory);

  const step2Title = (() => {
    if (!joinCategory) return "How are you joining?";
    if (!registrationPath) {
      return joinCategory === "PEOPLE" ? "Choose your role" : "Choose your venture";
    }
    if (registrationPath === "ENTREPRENEUR") return "Entrepreneur profile";
    if (registrationPath === "FOUNDER") return "Founder profile";
    if (registrationPath === "NEW_IDEA") return "New idea";
    if (registrationPath === "NEW_BUSINESS") return "New business";
    if (registrationPath === "STARTUP") return "Startup";
    if (registrationPath === "MENTOR") return "Mentor profile";
    if (registrationPath === "INVESTOR") return "Investor profile";
    return "Your details";
  })();

  const submitDisabled =
    pending ||
    !joinCategory ||
    !registrationPath ||
    !registrationPathMatchesJoin(registrationPath, joinCategory) ||
    (registrationPath === "ENTREPRENEUR" && !entrepreneurTrack) ||
    (registrationPath === "FOUNDER" && !founderTrack);

  return (
    <form
      action={action}
      className="space-y-5"
      onSubmit={(e) => {
        if (step !== 3) {
          e.preventDefault();
        }
      }}
    >
      <section
        ref={step1Ref}
        className="space-y-5 rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 p-5 sm:p-6"
        hidden={step !== 1}
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-400/90">Aspire Entrepreneur</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Create your account</h2>
          <p className="mt-2 text-sm text-slate-400">Step 1 of 3 — your contact details</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name" name="name" label="Full name" required />
          <Field id="email" name="email" label="Email" type="email" required />
          <Field id="password" name="password" label="Password" type="password" required />
          <Field id="phoneNumber" name="phoneNumber" label="Phone number" required placeholder="+923001234567" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="location" name="location" label="City / region" required />
          <Field id="zipCode" name="zipCode" label="Postal / ZIP code" required />
        </div>
        <Field id="country" name="country" label="Country" required />

        <button
          type="button"
          onClick={handleNextFromStep1}
          className={`w-full rounded-lg bg-cyan-600 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-900/30 transition hover:bg-cyan-500 ${focusPrimary}`}
        >
          Continue to step 2
        </button>
      </section>

      <section
        ref={step2Ref}
        className="space-y-6 rounded-2xl border border-slate-700/80 bg-slate-950/50 p-5 sm:p-6"
        hidden={step !== 2}
      >
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-400/90">Step 2 of 3</p>
            <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{step2Title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">
              Start with <strong className="text-slate-200">Entrepreneur</strong> if you are joining as a person (mentor,
              investor, entrepreneur, or founder), or <strong className="text-slate-200">New startups</strong> if you
              are leading a venture (new business, startup, or new idea). Each pick unlocks the next set of cards and
              fields.
            </p>
          </div>

          <fieldset className="space-y-3 rounded-xl border border-slate-600/60 bg-slate-900/35 p-4">
            <legend className="px-1 text-sm font-semibold text-white">
              I am joining as <span className="text-cyan-400">*</span>
            </legend>
            <p className="text-xs text-slate-500">Pick one — this unlocks either role options or venture options below.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <JoinModeCard
                title="Entrepreneur"
                description="Mentor, investor, entrepreneur, or founder — joining as a person in the network."
                selected={joinCategory === "PEOPLE"}
                onSelect={() => selectJoinCategory("PEOPLE")}
              />
              <JoinModeCard
                title="New startups"
                description="New business, startup, or new idea — joining with a venture or project to build."
                selected={joinCategory === "VENTURES"}
                onSelect={() => selectJoinCategory("VENTURES")}
              />
            </div>
          </fieldset>

          {joinCategory === "PEOPLE" ? (
            <fieldset className="space-y-3 rounded-xl border border-slate-600/60 bg-slate-900/35 p-4">
              <legend className="px-1 text-sm font-semibold text-white">
                Your role <span className="text-cyan-400">*</span>
              </legend>
              <p className="text-xs text-slate-500">Choose one role — then complete the fields that appear.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {ROLE_OPTIONS.map((opt) => (
                  <PathCard
                    key={opt.value}
                    option={opt}
                    checked={registrationPath === opt.value}
                    onSelect={() => {
                      setRegistrationPath(opt.value);
                      setEntrepreneurTrack("");
                      setFounderTrack("");
                    }}
                  />
                ))}
              </div>
            </fieldset>
          ) : null}

          {joinCategory === "VENTURES" ? (
            <fieldset className="space-y-3 rounded-xl border border-indigo-900/40 bg-indigo-950/10 p-4">
              <legend className="px-1 text-sm font-semibold text-indigo-100">
                Your venture path <span className="text-cyan-400">*</span>
              </legend>
              <p className="text-xs text-slate-500">New business, startup, or new idea — each path has its own questions.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {VENTURE_OPTIONS.map((opt) => (
                  <PathCard
                    key={opt.value}
                    option={opt}
                    checked={registrationPath === opt.value}
                    onSelect={() => {
                      setRegistrationPath(opt.value);
                      setEntrepreneurTrack("");
                      setFounderTrack("");
                    }}
                  />
                ))}
              </div>
            </fieldset>
          ) : null}

          {pathOkForStep && needsVentureBasics ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-600/50 bg-slate-900/40 p-4">
                <p className="text-sm font-semibold text-white">Venture basics</p>
                <p className="mt-1 text-xs text-slate-500">Working name, domain, and where you are today.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field id="ventureName" name="ventureName" label="Working name (venture, idea, or project)" required />
                  <Field id="industry" name="industry" label="Industry or domain" required />
                  <Field id="stage" name="stage" label="Where you are today" required placeholder="Exploring, MVP, revenue…" />
                  <Field id="fundingNeeded" name="fundingNeeded" label="Funding status (optional)" placeholder="Bootstrapped, raising…" />
                </div>
              </div>

              {registrationPath === "ENTREPRENEUR" ? (
                <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/15 p-4">
                  <p className="text-sm font-semibold text-cyan-200">Entrepreneur track</p>
                  <p className="mt-1 text-xs text-slate-400">Pick the line that best matches you — extra fields appear after.</p>
                  <div className="mt-4 space-y-1.5">
                    <label htmlFor="entrepreneurTrack" className="text-sm font-medium text-slate-200">
                      Your track <span className="text-cyan-400">*</span>
                    </label>
                    <select
                      id="entrepreneurTrack"
                      name="entrepreneurTrack"
                      required
                      value={entrepreneurTrack}
                      onChange={(e) => setEntrepreneurTrack(e.target.value as EntrepreneurTrack | "")}
                      className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      <option value="">Choose your track…</option>
                      {(Object.keys(ENTREPRENEUR_TRACK_LABELS) as EntrepreneurTrack[]).map((k) => (
                        <option key={k} value={k}>
                          {ENTREPRENEUR_TRACK_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </div>
                  {entrepreneurTrack ? (
                    <div className="mt-4 grid gap-4 border-t border-cyan-900/30 pt-4 sm:grid-cols-2">
                      {entrepreneurDefs.map((f) => (
                        <Field
                          key={f.name}
                          id={f.name}
                          name={f.name}
                          label={f.label}
                          required={f.required}
                          placeholder={f.placeholder}
                          type={f.type}
                          rows={undefined}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {registrationPath === "FOUNDER" ? (
                <div className="rounded-xl border border-violet-900/40 bg-violet-950/15 p-4">
                  <p className="text-sm font-semibold text-violet-200">Founder track</p>
                  <p className="mt-1 text-xs text-slate-400">Stage of the company you are leading — then answer the related prompts.</p>
                  <div className="mt-4 space-y-1.5">
                    <label htmlFor="founderTrack" className="text-sm font-medium text-slate-200">
                      Your track <span className="text-cyan-400">*</span>
                    </label>
                    <select
                      id="founderTrack"
                      name="founderTrack"
                      required
                      value={founderTrack}
                      onChange={(e) => setFounderTrack(e.target.value as FounderTrack | "")}
                      className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      <option value="">Choose your track…</option>
                      {(Object.keys(FOUNDER_TRACK_LABELS) as FounderTrack[]).map((k) => (
                        <option key={k} value={k}>
                          {FOUNDER_TRACK_LABELS[k]}
                        </option>
                      ))}
                    </select>
                  </div>
                  {founderTrack ? (
                    <div className="mt-4 grid gap-4 border-t border-violet-900/30 pt-4 sm:grid-cols-2">
                      {founderDefs.map((f) => (
                        <Field
                          key={f.name}
                          id={f.name}
                          name={f.name}
                          label={f.label}
                          required={f.required}
                          placeholder={f.placeholder}
                          type={f.type}
                          rows={undefined}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {registrationPath === "NEW_IDEA" ? (
                <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/15 p-4">
                  <p className="text-sm font-semibold text-indigo-200">Idea validation</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Separate from the entrepreneur path&apos;s &quot;validating an idea&quot; track — this flow is only for a venture-level new idea signup.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {IDEA_FIELDS.map((f) => (
                      <Field
                        key={f.name}
                        id={f.name}
                        name={f.name}
                        label={f.label}
                        required={f.required}
                        placeholder={f.placeholder}
                        type={f.type}
                        rows={undefined}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {registrationPath === "STARTUP" ? (
                <div className="rounded-xl border border-sky-900/40 bg-sky-950/15 p-4">
                  <p className="text-sm font-semibold text-sky-200">Startup details</p>
                  <p className="mt-1 text-xs text-slate-400">Product, milestones, and runway for an early-stage company.</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {STARTUP_FIELDS.map((f) => (
                      <Field
                        key={f.name}
                        id={f.name}
                        name={f.name}
                        label={f.label}
                        required={f.required}
                        placeholder={f.placeholder}
                        type={f.type}
                        rows={undefined}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {registrationPath === "NEW_BUSINESS" ? (
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/15 p-4">
                  <p className="text-sm font-semibold text-emerald-200">New business details</p>
                  <p className="mt-1 text-xs text-slate-400">Different from &quot;startup&quot; above — legal entity, model, and go-to-market basics.</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field id="businessName" name="businessName" label="Registered or trading name" required />
                    <Field id="businessModel" name="businessModel" label="Business model" required />
                    <Field id="targetMarket" name="targetMarket" label="Target market" required />
                    <Field id="launchTimeline" name="launchTimeline" label="Launch or growth timeline" required />
                    <Field id="teamBackground" name="teamBackground" label="Team background (optional)" />
                    <Field id="initialBudget" name="initialBudget" label="Initial budget (optional)" />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {pathOkForStep && registrationPath === "MENTOR" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="yearsExperience" name="yearsExperience" label="Years of experience (number)" type="number" required />
              <Field id="domainExpertise" name="domainExpertise" label="Domain expertise" required />
              <Field id="pastCompanies" name="pastCompanies" label="Past companies (optional)" />
              <Field id="mentoringStyle" name="mentoringStyle" label="Mentoring style (optional)" />
              <Field id="availability" name="availability" label="Availability (optional)" />
            </div>
          ) : null}

          {pathOkForStep && registrationPath === "INVESTOR" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="firmName" name="firmName" label="Firm or fund name" required />
              <Field id="checkSizeRange" name="checkSizeRange" label="Typical check size" required />
              <Field id="investmentStage" name="investmentStage" label="Stages you invest in" required />
              <Field id="sectorsOfInterest" name="sectorsOfInterest" label="Sectors of interest" required />
              <Field id="preferredGeography" name="preferredGeography" label="Preferred geography (optional)" />
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={pending}
              className={`w-full rounded-lg border border-slate-500 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/80 disabled:opacity-60 sm:w-auto ${focusGhost}`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNextFromStep2}
              disabled={submitDisabled}
              className={`w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-900/25 hover:bg-cyan-500 disabled:opacity-60 sm:flex-1 ${focusPrimary}`}
            >
              Continue to step 3
            </button>
          </div>
      </section>

      <section
        className="space-y-6 rounded-2xl border border-slate-700/80 bg-slate-950/50 p-5 sm:p-6"
        hidden={step !== 3}
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-400/90">Step 3 of 3</p>
          <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Profile & goals</h2>
          <p className="mt-1 text-sm text-slate-400">LinkedIn, experience, and a short introduction for the network.</p>
        </div>

        <div className="space-y-4">
          <Field id="linkedinUrl" name="linkedinUrl" label="LinkedIn URL" type="url" required placeholder="https://www.linkedin.com/in/…" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="experienceLevel" name="experienceLevel" label="Experience level" required placeholder="Beginner / Intermediate / Expert" />
            <Field id="primaryGoal" name="primaryGoal" label="Primary goal" required />
          </div>
          <Field id="joinAim" name="joinAim" label="Reason for joining" required rows={3} />
          <Field id="aboutYourself" name="aboutYourself" label="About yourself" required rows={4} />
        </div>

        {state?.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
        {state?.success ? <p className="text-sm text-emerald-400">{state.success}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={pending}
            className={`w-full rounded-lg border border-slate-500 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/80 disabled:opacity-60 sm:w-auto ${focusGhost}`}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={pending}
            className={`w-full rounded-lg bg-cyan-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-900/25 hover:bg-cyan-500 disabled:opacity-60 sm:flex-1 ${focusPrimary}`}
          >
            {pending ? "Creating account…" : "Create account"}
          </button>
        </div>
      </section>
    </form>
  );
}
