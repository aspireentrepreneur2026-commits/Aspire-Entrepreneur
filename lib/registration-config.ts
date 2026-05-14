/** Registration UI: entrepreneur / founder tracks and conditional field keys. */

/** Prisma roles that can result from the public registration form (no self-serve admin). */
export type RegistrationRole = "FOUNDER" | "MENTOR" | "INVESTOR";

/** Single choice in step 2 — maps to Prisma role + founder flows. */
export type RegistrationPath =
  | "MENTOR"
  | "INVESTOR"
  | "ENTREPRENEUR"
  | "FOUNDER"
  | "NEW_BUSINESS"
  | "STARTUP"
  | "NEW_IDEA";

/**
 * Sub-track when registration path is ENTREPRENEUR.
 * `VALIDATING_IDEA` is the entrepreneur “new idea” line — distinct from venture path `NEW_IDEA`.
 */
export type EntrepreneurTrack =
  | "NEW_BEGINNER"
  | "NEW_STARTUP"
  | "VALIDATING_IDEA"
  | "EXPERIENCED_ENTREPRENEUR"
  | "COMPANY_LEAD"
  | "INVESTOR_ENTREPRENEUR"
  | "SOLOPRENEUR"
  | "OTHER";

export type FounderTrack =
  | "EARLY_STARTUP"
  | "IDEA_STAGE"
  | "GROWTH_COMPANY"
  | "NONPROFIT"
  | "OTHER";

export const ENTREPRENEUR_TRACK_LABELS: Record<EntrepreneurTrack, string> = {
  NEW_BEGINNER: "New beginner — learning the ropes",
  NEW_STARTUP: "New startup — building the company",
  VALIDATING_IDEA: "New idea — validating a concept",
  EXPERIENCED_ENTREPRENEUR: "Experienced entrepreneur",
  COMPANY_LEAD: "Company / organization lead",
  INVESTOR_ENTREPRENEUR: "Investor & entrepreneur",
  SOLOPRENEUR: "Solopreneur / freelancer",
  OTHER: "Other",
};

export const FOUNDER_TRACK_LABELS: Record<FounderTrack, string> = {
  EARLY_STARTUP: "Early-stage startup",
  IDEA_STAGE: "Idea / pre-MVP",
  GROWTH_COMPANY: "Growth-stage company",
  NONPROFIT: "Nonprofit / impact venture",
  OTHER: "Other",
};

/** Extra fields per track (name suffix for form keys). */
export const ENTREPRENEUR_TRACK_FIELDS: Record<
  EntrepreneurTrack,
  { name: string; label: string; type?: string; required: boolean; placeholder?: string }[]
> = {
  NEW_BEGINNER: [
    { name: "ebFocus", label: "What do you want to learn first?", required: true, placeholder: "e.g. fundraising basics, product discovery" },
    { name: "ebSkills", label: "Current skills or background", required: true, placeholder: "Short summary" },
    { name: "ebSupport", label: "What support do you need?", required: true, placeholder: "Mentorship, community, tools…" },
  ],
  NEW_STARTUP: [
    { name: "esProblem", label: "Problem you are solving", required: true },
    { name: "esSolution", label: "Your solution (one line)", required: true },
    { name: "esCustomers", label: "Who is the first customer?", required: true },
  ],
  VALIDATING_IDEA: [
    { name: "eiTitle", label: "Idea title", required: true },
    { name: "eiHypothesis", label: "Core hypothesis to test", required: true },
    { name: "eiNextStep", label: "Next validation step", required: true },
  ],
  EXPERIENCED_ENTREPRENEUR: [
    { name: "eeVentures", label: "Past ventures or exits", required: true },
    { name: "eeFocusNow", label: "What are you building now?", required: true },
  ],
  COMPANY_LEAD: [
    { name: "ecCompany", label: "Company or org name", required: true },
    { name: "ecRole", label: "Your role", required: true },
    { name: "ecSize", label: "Team or org size", required: false, placeholder: "e.g. 10–50" },
  ],
  INVESTOR_ENTREPRENEUR: [
    { name: "einThesis", label: "Investment thesis (short)", required: true },
    { name: "einBuild", label: "What you are building as a founder", required: true },
  ],
  SOLOPRENEUR: [
    { name: "soOffering", label: "What you offer clients", required: true },
    { name: "soChannels", label: "How you find clients", required: false },
  ],
  OTHER: [
    { name: "eoDescribe", label: "Describe your path", required: true },
  ],
};

export const FOUNDER_TRACK_FIELDS: Record<
  FounderTrack,
  { name: string; label: string; type?: string; required: boolean; placeholder?: string }[]
> = {
  EARLY_STARTUP: [
    { name: "fsProduct", label: "Product or service", required: true },
    { name: "fsMilestone", label: "Next milestone", required: true },
    { name: "fsRunway", label: "Runway or funding status", required: false },
  ],
  IDEA_STAGE: [
    { name: "fiInsight", label: "Insight behind the idea", required: true },
    { name: "fiRisk", label: "Biggest risk you see", required: true },
  ],
  GROWTH_COMPANY: [
    { name: "fgMetric", label: "Key growth metric", required: true },
    { name: "fgHiring", label: "Hiring or scaling focus", required: false },
  ],
  NONPROFIT: [
    { name: "fnMission", label: "Mission", required: true },
    { name: "fnImpact", label: "Impact so far", required: false },
  ],
  OTHER: [
    { name: "foDescribe", label: "Describe your founder journey", required: true },
  ],
};
