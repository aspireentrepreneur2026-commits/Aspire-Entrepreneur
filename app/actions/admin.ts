"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type UserRole = "FOUNDER" | "MENTOR" | "INVESTOR" | "ADMIN";

export type AdminActionState = { error?: string; success?: string };

async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

async function assertCanChangeAdminRole(targetUserId: string, nextRole: UserRole) {
  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { role: true },
  });
  if (!target) {
    return "User not found.";
  }

  const removingAdmin = target.role === "ADMIN" && nextRole !== "ADMIN";
  if (!removingAdmin) {
    return null;
  }

  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  if (adminCount <= 1) {
    return "Cannot remove or change the last remaining platform admin.";
  }

  return null;
}

const roleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["FOUNDER", "MENTOR", "INVESTOR", "ADMIN"]),
});

export async function adminUpdateUserRole(
  _prev: AdminActionState | undefined,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "Not authorized." };
  }

  const parsed = roleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid role update." };
  }

  const block = await assertCanChangeAdminRole(parsed.data.userId, parsed.data.role);
  if (block) {
    return { error: block };
  }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath(`/dashboard/admin/users/${parsed.data.userId}`);
  return { success: "Role updated." };
}

const onboardingSchema = z.object({
  userId: z.string().min(1),
  onboardingStatus: z.enum(["BASIC", "ROLE_PROFILE", "COMPLETED"]),
});

export async function adminUpdateUserOnboarding(
  _prev: AdminActionState | undefined,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "Not authorized." };
  }

  const parsed = onboardingSchema.safeParse({
    userId: formData.get("userId"),
    onboardingStatus: formData.get("onboardingStatus"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid onboarding update." };
  }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { onboardingStatus: parsed.data.onboardingStatus },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath(`/dashboard/admin/users/${parsed.data.userId}`);
  return { success: "Onboarding status updated." };
}
