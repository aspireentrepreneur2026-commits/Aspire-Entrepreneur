import Link from "next/link";
import { ProfileAvatarImg } from "@/components/profile/profile-image-display";

export type MemberNetworkCardMember = {
  id: string;
  name: string;
  role: string;
  image: string | null;
  profileApprovalStatus: string;
  country: string | null;
  location: string | null;
  primaryGoal: string | null;
  joinAim: string | null;
  experienceLevel: string | null;
  createdAt: Date;
  founderProfile: {
    startupName: string;
    stage: string;
    industry: string;
    fundingNeeded: string | null;
  } | null;
  mentorProfile: {
    domainExpertise: string;
    yearsExperience: number;
    availability: string | null;
  } | null;
  investorProfile: {
    firmName: string;
    checkSizeRange: string;
    investmentStage: string;
    sectorsOfInterest: string;
  } | null;
};

export function MemberNetworkCard({ member }: { member: MemberNetworkCardMember }) {
  const initial = member.name.trim().charAt(0).toUpperCase() || "?";
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-sm transition hover:border-[#0a66c2]/30 hover:shadow-md">
      <Link href={`/members/${member.id}`} className="block p-4 transition hover:bg-slate-50/80">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-lg font-semibold text-white">
            <ProfileAvatarImg
              url={member.image}
              initial={initial}
              imgClassName="h-full w-full object-cover"
              fallbackClassName="text-lg font-semibold"
            />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0a66c2]">
              {member.role}
            </span>
            <h3 className="text-base font-semibold text-slate-900">{member.name}</h3>
            <p className="truncate text-xs text-slate-500">
              {member.location ?? "Location hidden"}
              {member.country ? ` · ${member.country}` : ""}
            </p>
            {member.profileApprovalStatus !== "APPROVED" ? (
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-amber-700">
                Profile: {member.profileApprovalStatus.toLowerCase()}
              </p>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="border-t border-slate-100 px-4 py-3 text-sm text-slate-700">
        <p className="line-clamp-2">
          <span className="font-semibold text-slate-900">Goal: </span>
          {member.primaryGoal ?? "—"}
        </p>
      </div>
      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 text-xs text-slate-600">
        <p className="line-clamp-2">
          <span className="font-semibold text-slate-900">Joined because: </span>
          {member.joinAim ?? "—"}
        </p>

        {member.founderProfile ? (
          <div className="mt-3 rounded-md border border-sky-100 bg-sky-50/80 p-2 text-[11px]">
            <p className="font-semibold text-sky-950">Business</p>
            <p>{member.founderProfile.startupName}</p>
            <p className="text-slate-600">
              {member.founderProfile.stage} · {member.founderProfile.industry}
            </p>
          </div>
        ) : null}

        {member.mentorProfile ? (
          <div className="mt-3 rounded-md border border-violet-100 bg-violet-50/80 p-2 text-[11px]">
            <p className="font-semibold text-violet-950">Mentor</p>
            <p>{member.mentorProfile.domainExpertise}</p>
          </div>
        ) : null}

        {member.investorProfile ? (
          <div className="mt-3 rounded-md border border-fuchsia-100 bg-fuchsia-50/80 p-2 text-[11px]">
            <p className="font-semibold text-fuchsia-950">Investor</p>
            <p>{member.investorProfile.firmName}</p>
          </div>
        ) : null}
      </div>
      <p className="px-4 pb-3 text-[10px] uppercase tracking-wide text-slate-400">
        Joined {new Date(member.createdAt).toLocaleDateString()}
      </p>
    </article>
  );
}
