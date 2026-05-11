import Link from "next/link";
import { MemberNetworkCard, type MemberNetworkCardMember } from "@/components/dashboard/member-network-card";

type Props = {
  members: MemberNetworkCardMember[];
  myDashboardHref: string;
};

export function MemberNetworkSection({ members, myDashboardHref }: Props) {
  return (
    <section id="network-members" className="scroll-mt-[5.75rem]" aria-labelledby="network-members-heading">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between lg:p-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a66c2]/10 text-lg"
              aria-hidden
            >
              👥
            </span>
            <h2 id="network-members-heading" className="text-xl font-semibold tracking-tight text-slate-900">
              Member network
            </h2>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Connect with founders, mentors, and investors who completed onboarding — only visible when you&apos;re signed
            in to Aspire. These profiles aren&apos;t indexed for anonymous public browsing.
          </p>
        </div>
        <Link
          href={myDashboardHref}
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-[#0a66c2] hover:border-[#0a66c2]/30 hover:bg-[#e8f3fc]"
        >
          My workspace →
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-800">Your member network will grow here</p>
          <p className="mt-2 text-sm text-slate-600">
            When people finish onboarding they appear automatically — invites stay inside Aspire, not on the open web.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <MemberNetworkCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </section>
  );
}
