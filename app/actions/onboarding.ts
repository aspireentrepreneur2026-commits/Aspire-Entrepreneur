"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { getRoleDashboardPath } from "@/lib/auth-redirect";

export type OnboardingActionState = {
  error?: string;
  success?: string;
};

const founderSchema = z.object({
  startupName: z.string().min(2, "Startup name is required."),
  stage: z.string().min(2, "Stage is required."),
  industry: z.string().min(2, "Industry is required."),
  teamSize: z.string().optional(),
  fundingNeeded: z.string().optional(),
});

const mentorSchema = z.object({
  yearsExperience: z.coerce.number().int().min(1, "Experience must be at least 1 year."),
  domainExpertise: z.string().min(2, "Domain expertise is required."),
  pastCompanies: z.string().optional(),
  availability: z.string().optional(),
});

const investorSchema = z.object({
  firmName: z.string().min(2, "Firm name is required."),
  checkSizeRange: z.string().min(2, "Check size range is required."),
  investmentStage: z.string().min(2, "Investment stage is required."),
  sectorsOfInterest: z.string().min(2, "Sectors of interest are required."),
  preferredGeography: z.string().optional(),
});

const adminSchema = z.object({
  governanceFocus: z.string().min(5, "Governance focus is required."),
  moderationPolicy: z.string().min(5, "Moderation policy is required."),
  portalGoal: z.string().min(5, "Portal goal is required."),
});

export async function completeFounderOnboarding(
  _prevState: OnboardingActionState | undefined,
  formData: FormData,
): Promise<OnboardingActionState> {
  const session = await requireAuth();
  if (session.user.role !== "FOUNDER") {
    return { error: "Only founders can submit founder onboarding." };
  }

  const parsed = founderSchema.safeParse({
    startupName: formData.get("startupName"),
    stage: formData.get("stage"),
    industry: formData.get("industry"),
    teamSize: formData.get("teamSize"),
    fundingNeeded: formData.get("fundingNeeded"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid founder profile data." };
  }

  await prisma.founderProfile.upsert({
    where: { userId: session.user.id },
    update: parsed.data,
    create: { userId: session.user.id, ...parsed.data },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStatus: "COMPLETED" },
  });

  redirect(getRoleDashboardPath("FOUNDER"));
}

export async function completeMentorOnboarding(
  _prevState: OnboardingActionState | undefined,
  formData: FormData,
): Promise<OnboardingActionState> {
  const session = await requireAuth();
  if (session.user.role !== "MENTOR") {
    return { error: "Only mentors can submit mentor onboarding." };
  }

  const parsed = mentorSchema.safeParse({
    yearsExperience: formData.get("yearsExperience"),
    domainExpertise: formData.get("domainExpertise"),
    pastCompanies: formData.get("pastCompanies"),
    availability: formData.get("availability"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid mentor profile data." };
  }

  await prisma.mentorProfile.upsert({
    where: { userId: session.user.id },
    update: parsed.data,
    create: { userId: session.user.id, ...parsed.data },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStatus: "COMPLETED" },
  });

  redirect(getRoleDashboardPath("MENTOR"));
}

export async function completeInvestorOnboarding(
  _prevState: OnboardingActionState | undefined,
  formData: FormData,
): Promise<OnboardingActionState> {
  const session = await requireAuth();
  if (session.user.role !== "INVESTOR") {
    return { error: "Only investors can submit investor onboarding." };
  }

  const parsed = investorSchema.safeParse({
    firmName: formData.get("firmName"),
    checkSizeRange: formData.get("checkSizeRange"),
    investmentStage: formData.get("investmentStage"),
    sectorsOfInterest: formData.get("sectorsOfInterest"),
    preferredGeography: formData.get("preferredGeography"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid investor profile data." };
  }

  await prisma.investorProfile.upsert({
    where: { userId: session.user.id },
    update: parsed.data,
    create: { userId: session.user.id, ...parsed.data },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStatus: "COMPLETED" },
  });

  redirect(getRoleDashboardPath("INVESTOR"));
}

export async function completeAdminOnboarding(
  _prevState: OnboardingActionState | undefined,
  formData: FormData,
): Promise<OnboardingActionState> {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") {
    return { error: "Only admins can submit admin onboarding." };
  }

  const parsed = adminSchema.safeParse({
    governanceFocus: formData.get("governanceFocus"),
    moderationPolicy: formData.get("moderationPolicy"),
    portalGoal: formData.get("portalGoal"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid admin onboarding data." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      primaryGoal: parsed.data.portalGoal,
      joinAim: parsed.data.governanceFocus,
      aboutYourself: parsed.data.moderationPolicy,
      onboardingStatus: "COMPLETED",
    },
  });

  redirect(getRoleDashboardPath("ADMIN"));
}
