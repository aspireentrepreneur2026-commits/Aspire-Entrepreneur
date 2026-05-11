import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminUserDetailForms } from "@/components/admin/admin-user-detail-forms";
import type { AdminUserRowModel } from "@/components/admin/admin-user-row";
import { publicUserMediaUrl } from "@/lib/profile-media-url";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

type ProfessionalDepthFields = {
  industryExpertiseNarrative: string | null;
  studyWorkBackground: string | null;
  achievements: string | null;
  investmentCapital: string | null;
  investmentInterest: string | null;
  investmentHistory: string | null;
};

export default async function AdminUserDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const session = await requireRole(["ADMIN"]);
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      founderProfile: true,
      mentorProfile: true,
      investorProfile: true,
    },
  });

  if (!user) {
    notFound();
  }

  const rowModel: AdminUserRowModel = {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    onboardingStatus: user.onboardingStatus,
    profileApprovalStatus: user.profileApprovalStatus,
    profileApprovalNote: user.profileApprovalNote,
    image: user.image,
    coverImageUrl: user.coverImageUrl,
    primaryGoal: user.primaryGoal,
    joinAim: user.joinAim,
    country: user.country,
    location: user.location,
    createdAt: user.createdAt.toISOString(),
    founderProfile: user.founderProfile
      ? {
          startupName: user.founderProfile.startupName,
          stage: user.founderProfile.stage,
          industry: user.founderProfile.industry,
          traction: user.founderProfile.traction,
        }
      : null,
    mentorProfile: user.mentorProfile
      ? { domainExpertise: user.mentorProfile.domainExpertise }
      : null,
    investorProfile: user.investorProfile
      ? { firmName: user.investorProfile.firmName }
      : null,
  };

  const adminAvatarSrc = publicUserMediaUrl(user.image);
  const adminCoverSrc = publicUserMediaUrl(user.coverImageUrl);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <Link href="/dashboard/admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
        ← All users
      </Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
        <p className="text-xs uppercase tracking-wide text-slate-500">User record</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{user.name}</h1>
        <p className="mt-1 text-slate-600">{user.email}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
            Profile: {user.profileApprovalStatus}
          </span>
          <Link
            href={`/members/${user.id}`}
            className="text-sm font-semibold text-[#0a66c2] hover:underline"
          >
            View as member →
          </Link>
        </div>

        {(adminAvatarSrc || adminCoverSrc) && (
          <div className="mt-6 flex flex-wrap gap-4">
            {adminAvatarSrc ? (
              <div>
                <p className="text-xs font-medium text-slate-500">Profile photo</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={adminAvatarSrc} alt="" className="mt-1 h-20 w-20 rounded-full border border-slate-200 object-cover" />
              </div>
            ) : null}
            {adminCoverSrc ? (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500">Cover</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={adminCoverSrc}
                  alt=""
                  className="mt-1 h-16 max-w-md rounded-lg border border-slate-200 object-cover"
                />
              </div>
            ) : null}
          </div>
        )}

        <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">Phone</dt>
            <dd className="text-slate-900">{user.phoneNumber ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Country</dt>
            <dd className="text-slate-900">{user.country ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-slate-500">Location</dt>
            <dd className="text-slate-900">{user.location ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-slate-500">LinkedIn</dt>
            <dd className="break-all text-slate-900">{user.linkedinUrl ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-slate-500">Join aim</dt>
            <dd className="text-slate-900">{user.joinAim ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-medium text-slate-500">About</dt>
            <dd className="text-slate-900">{user.aboutYourself ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Experience</dt>
            <dd className="text-slate-900">{user.experienceLevel ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Primary goal</dt>
            <dd className="text-slate-900">{user.primaryGoal ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Extended profile completed</dt>
            <dd className="text-slate-900">
              {user.extendedProfileCompletedAt
                ? user.extendedProfileCompletedAt.toLocaleString()
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Joined</dt>
            <dd className="text-slate-900">{user.createdAt.toLocaleString()}</dd>
          </div>
        </dl>

        {user.founderProfile ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Founder / startup profile</p>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Startup name</dt>
                <dd>{user.founderProfile.startupName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Stage / timeline</dt>
                <dd>{user.founderProfile.stage}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Industry / market</dt>
                <dd>{user.founderProfile.industry}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Team size</dt>
                <dd>{user.founderProfile.teamSize ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Funding</dt>
                <dd>{user.founderProfile.fundingNeeded ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Traction / category</dt>
                <dd>{user.founderProfile.traction ?? "—"}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        {user.mentorProfile ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Mentor profile</p>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Years experience</dt>
                <dd>{user.mentorProfile.yearsExperience}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Domain expertise</dt>
                <dd>{user.mentorProfile.domainExpertise}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Past companies</dt>
                <dd>{user.mentorProfile.pastCompanies ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Style</dt>
                <dd>{user.mentorProfile.mentoringStyle ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Availability</dt>
                <dd>{user.mentorProfile.availability ?? "—"}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        {user.investorProfile ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Investor profile</p>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Firm</dt>
                <dd>{user.investorProfile.firmName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Check size</dt>
                <dd>{user.investorProfile.checkSizeRange}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Stage</dt>
                <dd>{user.investorProfile.investmentStage}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Sectors</dt>
                <dd>{user.investorProfile.sectorsOfInterest}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Geography</dt>
                <dd>{user.investorProfile.preferredGeography ?? "—"}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        <AdminExtendedProfileSection user={user} />

        <div className="mt-10 border-t border-slate-200 pt-8">
          <p className="text-sm font-semibold text-slate-800">Admin controls</p>
          <p className="mt-1 text-sm text-slate-600">
            Change platform role and onboarding stage for this account.
          </p>
          <AdminUserDetailForms model={rowModel} currentUserId={session.user.id} />
        </div>
      </div>
    </main>
  );
}

function AdminExtendedProfileSection({
  user,
}: Readonly<{
  user: {
    role: string;
    founderProfile: ProfessionalDepthFields | null;
    mentorProfile: ProfessionalDepthFields | null;
    investorProfile: ProfessionalDepthFields | null;
  };
}>) {
  const extended =
    user.role === "FOUNDER"
      ? user.founderProfile
      : user.role === "MENTOR"
        ? user.mentorProfile
        : user.role === "INVESTOR"
          ? user.investorProfile
          : null;

  if (!extended) {
    return null;
  }

  const hasAny =
    !!extended.industryExpertiseNarrative?.trim() ||
    !!extended.studyWorkBackground?.trim() ||
    !!extended.achievements?.trim() ||
    !!extended.investmentCapital?.trim() ||
    !!extended.investmentInterest?.trim() ||
    !!extended.investmentHistory?.trim();

  return (
    <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
      <p className="text-sm font-semibold text-slate-800">Professional depth (post-onboarding)</p>
      {!hasAny ? (
        <p className="mt-2 text-sm text-slate-600">No extended fields submitted yet.</p>
      ) : (
        <dl className="mt-3 space-y-3 text-sm">
          <AdminProfileRow label="Industry expertise" value={extended.industryExpertiseNarrative} />
          <AdminProfileRow label="Study & work background" value={extended.studyWorkBackground} />
          <AdminProfileRow label="Achievements" value={extended.achievements} />
          <AdminProfileRow label="Investment capital" value={extended.investmentCapital} />
          <AdminProfileRow label="Investment interest" value={extended.investmentInterest} />
          <AdminProfileRow label="Investment history" value={extended.investmentHistory} />
        </dl>
      )}
    </div>
  );
}

function AdminProfileRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value?.trim()) {
    return (
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="mt-0.5 text-slate-500">—</dd>
      </div>
    );
  }
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-slate-900">{value}</dd>
    </div>
  );
}
