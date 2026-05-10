import Link from "next/link";

const hubs = [
  {
    id: "ideas-hub" as const,
    icon: "💡",
    title: "Ideas & discovery",
    blurb:
      "Validate concepts, sketch MVPs, and get early feedback — post in the feed with #idea tag (tagging UX coming soon).",
    bullets: ["Problem-first framing", "Customer interviews checklist", "Competition scan"],
    cta: { label: "Start a feed post →", hash: "#feed-start" },
  },
  {
    id: "new-business-spotlight" as const,
    icon: "🏪",
    title: "New businesses & SMEs",
    blurb:
      "Operational launches, boutiques, agencies, franchises — separate from VC-style startups. Share traction and hires here.",
    bullets: ["Local & digital reach", "Co-founder / partner search", "Supplier & channel intros"],
    cta: { label: "Share an update →", hash: "#feed-start" },
  },
  {
    id: "funding-desk" as const,
    icon: "💰",
    title: "Funding & investors",
    blurb: "Warm intros, pitch prep, and deck feedback — full matching & data rooms are on the roadmap.",
    bullets: ["SAFE / bridge basics", "Investor update templates", "Cap table hygiene"],
    cta: { label: "Complete founder profile", href: "/onboarding" as const },
  },
  {
    id: "mentorship-lab" as const,
    icon: "🎓",
    title: "Mentorship & circles",
    blurb:
      "Office hours-style help from mentors — structured programs and peer groups arrive in a future release.",
    bullets: ["Mentor dashboards live", "Group sessions • soon", "Accountability buddies • soon"],
    cta: { label: "Find mentors →", hash: "#discover" },
  },
  {
    id: "startup-jobs" as const,
    icon: "💼",
    title: "Startup jobs",
    blurb:
      "Hiring board for early teams — postings, ATS sync, and apply-in-app flows are planned next.",
    bullets: ["Part-time / intern roles", "Equity-heavy roles", "Remote-friendly tags • soon"],
    cta: { label: "Use feed to announce hiring →", hash: "#feed-start" },
  },
  {
    id: "learning-grow" as const,
    icon: "📚",
    title: "Learning & playbook",
    blurb:
      "Curated entrepreneurship micro-lessons — today, use Discovery + feed to learn from peers’ posts.",
    bullets: ["GTM teardowns • soon", "Legal & finance primer • soon", "Weekly founder AMA • soon"],
    cta: { label: "Browse community profiles", hash: "#discover" },
  },
];

export function DashboardEntrepreneurHub() {
  return (
    <section
      aria-labelledby="entrepreneur-hub-heading"
      className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-sm"
    >
      <h2 id="entrepreneur-hub-heading" className="text-lg font-semibold text-slate-900">
        Founder & business toolkit
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Mirrors what you see on large social networks — tailored to Aspire: ideas, new ventures, mentorship, hiring,
        and growth.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {hubs.map((h) => (
          <article
            key={h.id}
            id={h.id}
            className="scroll-mt-[6.5rem] rounded-lg border border-slate-100 bg-slate-50/80 p-4 transition hover:border-[#0a66c2]/25 hover:bg-white"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none" aria-hidden>
                {h.icon}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900">{h.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{h.blurb}</p>
                <ul className="mt-2 list-inside list-disc text-xs text-slate-500">
                  {h.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {"href" in h.cta && h.cta.href ? (
                  <Link
                    href={h.cta.href}
                    className="mt-3 inline-block text-sm font-semibold text-[#0a66c2] hover:underline"
                  >
                    {h.cta.label}
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard${(h.cta as { hash: string }).hash}`}
                    className="mt-3 inline-block text-sm font-semibold text-[#0a66c2] hover:underline"
                  >
                    {h.cta.label}
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
