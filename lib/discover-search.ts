import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const TAKE = 48;

function keywordOr(q: string): Prisma.UserWhereInput {
  return {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phoneNumber: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
      { country: { contains: q, mode: "insensitive" } },
      { primaryGoal: { contains: q, mode: "insensitive" } },
      { joinAim: { contains: q, mode: "insensitive" } },
      { aboutYourself: { contains: q, mode: "insensitive" } },
      { founderProfile: { is: { startupName: { contains: q, mode: "insensitive" } } } },
      { founderProfile: { is: { industry: { contains: q, mode: "insensitive" } } } },
      { founderProfile: { is: { stage: { contains: q, mode: "insensitive" } } } },
      { mentorProfile: { is: { domainExpertise: { contains: q, mode: "insensitive" } } } },
      { investorProfile: { is: { firmName: { contains: q, mode: "insensitive" } } } },
      { investorProfile: { is: { sectorsOfInterest: { contains: q, mode: "insensitive" } } } },
      { investorProfile: { is: { investmentStage: { contains: q, mode: "insensitive" } } } },
    ],
  };
}

function ideasKeywordOr(q: string): Prisma.UserWhereInput {
  return {
    OR: [
      { primaryGoal: { contains: q, mode: "insensitive" } },
      { joinAim: { contains: q, mode: "insensitive" } },
      { aboutYourself: { contains: q, mode: "insensitive" } },
    ],
  };
}

/**
 * Member discover for signed-in users: excludes admins, incomplete onboarding, and the viewer.
 * Optional `q` keeps legacy broad “keywords” URL working.
 * `contact` matches name, email, or phone (OR) in one box.
 */
export async function discoverSearchMembers(params: {
  viewerId: string;
  contact?: string;
  company?: string;
  investmentRange?: string;
  teamSize?: string;
  q?: string;
  type?: string;
  location?: string;
}) {
  const contact = (params.contact ?? "").trim();
  const company = (params.company ?? "").trim();
  const investmentRange = (params.investmentRange ?? "").trim();
  const teamSize = (params.teamSize ?? "").trim();
  const q = (params.q ?? "").trim();
  const location = (params.location ?? "").trim();
  const type = (params.type ?? "").trim().toLowerCase();

  const and: Prisma.UserWhereInput[] = [
    { NOT: { role: "ADMIN" } },
    { onboardingStatus: "COMPLETED" },
    { id: { not: params.viewerId } },
  ];

  if (type === "founders" || type === "startups") {
    and.push({ role: "FOUNDER" });
    if (type === "startups") {
      and.push({ founderProfile: { is: { id: { not: "" } } } });
    }
  } else if (type === "mentors") {
    and.push({ role: "MENTOR" });
  } else if (type === "investors") {
    and.push({ role: "INVESTOR" });
  }

  if (location) {
    and.push({
      OR: [
        { location: { contains: location, mode: "insensitive" } },
        { country: { contains: location, mode: "insensitive" } },
      ],
    });
  }

  if (contact) {
    and.push({
      OR: [
        { name: { contains: contact, mode: "insensitive" } },
        { email: { contains: contact, mode: "insensitive" } },
        { phoneNumber: { contains: contact, mode: "insensitive" } },
      ],
    });
  }

  if (company) {
    and.push({
      OR: [
        { founderProfile: { is: { startupName: { contains: company, mode: "insensitive" } } } },
        { investorProfile: { is: { firmName: { contains: company, mode: "insensitive" } } } },
      ],
    });
  }

  if (investmentRange) {
    and.push({
      OR: [
        { founderProfile: { is: { fundingNeeded: { contains: investmentRange, mode: "insensitive" } } } },
        { investorProfile: { is: { checkSizeRange: { contains: investmentRange, mode: "insensitive" } } } },
      ],
    });
  }

  if (teamSize) {
    and.push({
      founderProfile: { is: { teamSize: { contains: teamSize, mode: "insensitive" } } },
    });
  }

  if (q) {
    if (type === "ideas") {
      and.push(ideasKeywordOr(q));
    } else {
      and.push(keywordOr(q));
    }
  }

  return prisma.user.findMany({
    where: { AND: and },
    orderBy: { updatedAt: "desc" },
    take: TAKE,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      country: true,
      location: true,
      role: true,
      primaryGoal: true,
      joinAim: true,
      profileApprovalStatus: true,
      founderProfile: {
        select: {
          startupName: true,
          stage: true,
          industry: true,
          fundingNeeded: true,
          teamSize: true,
        },
      },
      mentorProfile: {
        select: { domainExpertise: true, yearsExperience: true },
      },
      investorProfile: {
        select: {
          firmName: true,
          checkSizeRange: true,
          investmentStage: true,
          sectorsOfInterest: true,
        },
      },
    },
  });
}

export type DiscoverMember = Awaited<ReturnType<typeof discoverSearchMembers>>[number];
