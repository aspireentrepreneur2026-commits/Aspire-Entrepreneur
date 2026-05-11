export type HubCta = { label: string; hash: string } | { label: string; href: string };

export type HubEntry = {
  id: string;
  icon: string;
  title: string;
  blurb: string;
  bullets: string[];
  cta: HubCta;
  accent: {
    gradient: string;
    bar: string;
    iconBg: string;
  };
};

/** Ideas & validation — lives on `/dashboard/ideas` and the Ideas tab on the home toolkit. */
export const IDEAS_HUB_ENTRIES: HubEntry[] = [
  {
    id: "ideas-hub",
    icon: "💡",
    title: "Ideas & discovery",
    blurb:
      "Validate concepts, sketch MVPs, and get early feedback — start in the feed; hashtag-style tagging UX is on the roadmap.",
    bullets: ["Problem-first framing", "Customer interviews checklist", "Light competition scan"],
    cta: { label: "Start a feed post →", hash: "#feed-start" },
    accent: {
      gradient: "from-amber-50 to-orange-50/60",
      bar: "bg-gradient-to-b from-amber-400 to-orange-500",
      iconBg: "bg-amber-100 text-amber-900 ring-amber-200/80",
    },
  },
  {
    id: "learning-grow",
    icon: "📚",
    title: "Learning & playbook",
    blurb:
      "Curated entrepreneurship micro-lessons are coming soon — meanwhile, learn from the feed and structured profiles in your member network.",
    bullets: ["GTM teardowns • soon", "Legal & finance primer • soon", "Weekly founder AMA • soon"],
    cta: { label: "Open member network →", hash: "#network-members" },
    accent: {
      gradient: "from-rose-50 to-orange-50/30",
      bar: "bg-gradient-to-b from-rose-400 to-orange-500",
      iconBg: "bg-rose-100 text-rose-950 ring-rose-200/80",
    },
  },
];

/** Former “Business” toolkit cards — lives on `/dashboard/startups`. */
export const STARTUPS_TOOLKIT_ENTRIES: HubEntry[] = [
  {
    id: "new-business-spotlight",
    icon: "🏪",
    title: "New businesses & SMEs",
    blurb:
      "Boutiques, agencies, franchises, and SMB launches — separate from VC-style startups. Share traction and hiring needs.",
    bullets: ["Local & digital reach", "Co-founder / partner search", "Supplier & channel intros"],
    cta: { label: "Share an update →", hash: "#feed-start" },
    accent: {
      gradient: "from-emerald-50 to-teal-50/50",
      bar: "bg-gradient-to-b from-emerald-400 to-teal-600",
      iconBg: "bg-emerald-100 text-emerald-950 ring-emerald-200/80",
    },
  },
  {
    id: "funding-desk",
    icon: "💰",
    title: "Funding & investors",
    blurb: "Warm intros, pitch prep, and deck feedback — full matching & data rooms are on the roadmap.",
    bullets: ["SAFE / bridge basics", "Investor update templates", "Cap table hygiene"],
    cta: { label: "Complete founder profile", href: "/onboarding" },
    accent: {
      gradient: "from-violet-50 to-fuchsia-50/40",
      bar: "bg-gradient-to-b from-violet-500 to-fuchsia-600",
      iconBg: "bg-violet-100 text-violet-950 ring-violet-200/80",
    },
  },
  {
    id: "mentorship-lab",
    icon: "🎓",
    title: "Mentorship & circles",
    blurb:
      "Office hours-style help from mentors — structured programs and peer groups arrive in a future release.",
    bullets: ["Mentor dashboards live", "Group sessions • soon", "Accountability buddies • soon"],
    cta: { label: "Browse member network →", hash: "#network-members" },
    accent: {
      gradient: "from-sky-50 to-blue-50/40",
      bar: "bg-gradient-to-b from-sky-400 to-[#0a66c2]",
      iconBg: "bg-sky-100 text-sky-950 ring-sky-200/80",
    },
  },
  {
    id: "startups",
    icon: "💼",
    title: "Startups",
    blurb: "Surface your startup and team growth — discovery, matching, and apply-in-app flows are planned next.",
    bullets: ["Early-stage startup profiles", "Growth & fundraising milestones", "Remote-friendly tags • soon"],
    cta: { label: "Highlight your startup in the feed →", hash: "#feed-start" },
    accent: {
      gradient: "from-slate-50 to-indigo-50/45",
      bar: "bg-gradient-to-b from-indigo-400 to-slate-700",
      iconBg: "bg-indigo-100 text-indigo-950 ring-indigo-200/80",
    },
  },
];

export const IDEAS_HUB_IDS = Object.fromEntries(IDEAS_HUB_ENTRIES.map((h) => [h.id, true])) as Record<string, boolean>;

export const STARTUPS_TOOLKIT_IDS = Object.fromEntries(
  STARTUPS_TOOLKIT_ENTRIES.map((h) => [h.id, true]),
) as Record<string, boolean>;
