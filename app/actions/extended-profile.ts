"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ExtendedProfileState = { error?: string; success?: string };

const field = z
  .string()
  .trim()
  .min(10, "Each section should be at least 10 characters when completing your full professional profile.");

const extendedBodySchema = z.object({
  industryExpertiseNarrative: field,
  studyWorkBackground: field,
  achievements: field,
  investmentCapital: field,
  investmentInterest: field,
  investmentHistory: field,
});

function parseForm(formData: FormData) {
  return {
    industryExpertiseNarrative: String(formData.get("industryExpertiseNarrative") ?? "").trim(),
    studyWorkBackground: String(formData.get("studyWorkBackground") ?? "").trim(),
    achievements: String(formData.get("achievements") ?? "").trim(),
    investmentCapital: String(formData.get("investmentCapital") ?? "").trim(),
    investmentInterest: String(formData.get("investmentInterest") ?? "").trim(),
    investmentHistory: String(formData.get("investmentHistory") ?? "").trim(),
  };
}

export async function saveExtendedProfileAction(
  _prev: ExtendedProfileState | undefined,
  formData: FormData,
): Promise<ExtendedProfileState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const role = session.user.role;
  if (role === "ADMIN") {
    return { error: "Admins use the main settings form only." };
  }

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingStatus: true, founderProfile: { select: { id: true } }, mentorProfile: { select: { id: true } }, investorProfile: { select: { id: true } } },
  });
  if (!me || me.onboardingStatus !== "COMPLETED") {
    return { error: "Finish onboarding first, then complete your extended profile." };
  }

  if (role === "FOUNDER" && !me.founderProfile) {
    return { error: "Founder profile not found. Complete basic profile in Settings first." };
  }
  if (role === "MENTOR" && !me.mentorProfile) {
    return { error: "Mentor profile not found. Complete basic profile in Settings first." };
  }
  if (role === "INVESTOR" && !me.investorProfile) {
    return { error: "Investor profile not found. Complete basic profile in Settings first." };
  }

  const raw = parseForm(formData);
  const parsed = extendedBodySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check all fields." };
  }

  const data = parsed.data;

  if (role === "FOUNDER") {
    await prisma.founderProfile.update({
      where: { userId: session.user.id },
      data: data,
    });
  } else if (role === "MENTOR") {
    await prisma.mentorProfile.update({
      where: { userId: session.user.id },
      data: data,
    });
  } else if (role === "INVESTOR") {
    await prisma.investorProfile.update({
      where: { userId: session.user.id },
      data: data,
    });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { extendedProfileCompletedAt: new Date() },
  });

  revalidatePath("/settings");
  revalidatePath("/settings/extended-profile");
  revalidatePath("/dashboard");
  revalidatePath(`/members/${session.user.id}`);
  return { success: "Professional profile saved. Thank you — members can now see these details on your card." };
}
