"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { isAllowedProfileImageUrl } from "@/lib/profile-media-url";
import { prisma } from "@/lib/prisma";

export type ProfileActionState = { error?: string; success?: string };

const mediaSchema = z.object({
  profileImageUrl: z.string().optional(),
  coverImageUrl: z.string().optional(),
});

export async function saveProfileMediaAction(
  _prev: ProfileActionState | undefined,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in." };
  }

  const parsed = mediaSchema.safeParse({
    profileImageUrl: formData.get("profileImageUrl")?.toString().trim() || undefined,
    coverImageUrl: formData.get("coverImageUrl")?.toString().trim() || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { profileImageUrl, coverImageUrl } = parsed.data;
  if (!profileImageUrl && !coverImageUrl) {
    return { error: "Nothing to save." };
  }

  if (profileImageUrl && !isAllowedProfileImageUrl(profileImageUrl)) {
    return { error: "Invalid profile photo URL." };
  }
  if (coverImageUrl && !isAllowedProfileImageUrl(coverImageUrl)) {
    return { error: "Invalid cover image URL." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(profileImageUrl ? { image: profileImageUrl } : {}),
      ...(coverImageUrl ? { coverImageUrl } : {}),
    },
  });

  revalidatePath("/settings");
  revalidatePath(`/members/${session.user.id}`);
  revalidatePath("/dashboard");
  return { success: "Profile images saved." };
}

export async function followUserAction(targetUserId: string): Promise<ProfileActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Sign in to follow members." };
  }
  if (targetUserId === session.user.id) {
    return { error: "You cannot follow yourself." };
  }

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, profileApprovalStatus: true },
  });
  if (!target) {
    return { error: "Member not found." };
  }
  if (target.profileApprovalStatus !== "APPROVED") {
    return { error: "You can only follow members with an approved profile." };
  }

  await prisma.userFollow.upsert({
    where: {
      followerId_followingId: { followerId: session.user.id, followingId: targetUserId },
    },
    create: { followerId: session.user.id, followingId: targetUserId },
    update: {},
  });

  revalidatePath(`/members/${targetUserId}`);
  revalidatePath("/dashboard");
  return { success: "Following." };
}

export async function unfollowUserAction(targetUserId: string): Promise<ProfileActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Sign in." };
  }

  await prisma.userFollow.deleteMany({
    where: { followerId: session.user.id, followingId: targetUserId },
  });

  revalidatePath(`/members/${targetUserId}`);
  revalidatePath("/dashboard");
  return { success: "Unfollowed." };
}
