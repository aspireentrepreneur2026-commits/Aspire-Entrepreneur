import Link from "next/link";
import type { HubEntry } from "@/components/dashboard/entrepreneur-hub-data";

type Props = {
  h: HubEntry;
  /** Base for hash CTAs, e.g. `/dashboard` or `/dashboard/ideas` */
  dashboardBase?: string;
};

export function HubToolkitCard({ h, dashboardBase = "/dashboard" }: Props) {
  return (
    <article
      id={h.id}
      className={`group relative scroll-mt-[6.5rem] overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-br ${h.accent.gradient} p-[1px] shadow-sm transition hover:border-[#0a66c2]/25 hover:shadow-md`}
    >
      <div className="flex h-full flex-col rounded-[11px] bg-white/92 p-5 backdrop-blur-[2px] sm:p-6">
        <div className={`absolute left-0 top-0 hidden h-full w-1 rounded-l-xl sm:block ${h.accent.bar}`} aria-hidden />

        <div className="flex gap-4 pl-1 sm:pl-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl shadow-sm ring-1 ring-inset ${h.accent.iconBg}`}
            aria-hidden
          >
            {h.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-[17px] font-semibold tracking-tight text-slate-900">{h.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{h.blurb}</p>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-600">
              {h.bullets.map((b) => (
                <li
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-50/90 px-2.5 py-1 ring-1 ring-slate-100"
                >
                  <span className="h-1 w-1 rounded-full bg-emerald-500" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex shrink-0 pl-1 sm:pl-3">
          {"href" in h.cta && h.cta.href ? (
            <Link
              href={h.cta.href}
              className="inline-flex items-center rounded-full bg-[#0a66c2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#004182]"
            >
              {h.cta.label}
            </Link>
          ) : (
            <Link
              href={`${dashboardBase}${(h.cta as { hash: string }).hash}`}
              className="inline-flex items-center rounded-full border border-[#0a66c2]/25 bg-[#e8f3fc]/70 px-4 py-2 text-sm font-semibold text-[#004182] transition hover:border-[#0a66c2]/45 hover:bg-[#e8f3fc]"
            >
              {h.cta.label}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
