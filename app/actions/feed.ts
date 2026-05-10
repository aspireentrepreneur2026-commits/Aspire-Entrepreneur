"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { FeedAttachmentKind } from "@prisma/client";
import { inferFeedAttachmentKind, isAllowedFeedMediaUrl } from "@/lib/feed-attachment";

export type FeedActionState = { error?: string; success?: string };

const attachmentEntrySchema = z.object({
  url: z.string().refine(isAllowedFeedMediaUrl, "Invalid media URL."),
  kind: z.enum(["IMAGE", "VIDEO", "LINK"]).optional(),
});

const createPostSchema = z.object({
  body: z.string().trim().min(1, "Write something for your post.").max(8000, "Post is too long."),
  attachmentsJson: z.string().optional(),
  urlsText: z.string().optional(),
});

export async function createFeedPost(
  _prev: FeedActionState | undefined,
  formData: FormData,
): Promise<FeedActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to post." };
  }

  const parsed = createPostSchema.safeParse({
    body: formData.get("body"),
    attachmentsJson: formData.get("attachmentsJson") ?? "",
    urlsText: formData.get("urls") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid post." };
  }

  const attachments: { url: string; kind: FeedAttachmentKind }[] = [];
  const metaRaw = parsed.data.attachmentsJson?.trim();

  if (metaRaw) {
    let parsedItems: unknown;
    try {
      parsedItems = JSON.parse(metaRaw);
    } catch {
      return { error: "Invalid attachments data." };
    }
    const rows = z.array(attachmentEntrySchema).safeParse(parsedItems);
    if (!rows.success) {
      return { error: rows.error.issues[0]?.message ?? "Invalid attachments." };
    }
    for (const row of rows.data.slice(0, 10)) {
      const kind = row.kind ?? inferFeedAttachmentKind(row.url);
      attachments.push({ url: row.url.trim(), kind });
    }
  } else {
    const lines = parsed.data.urlsText
      ? String(parsed.data.urlsText)
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    for (const line of lines.slice(0, 10)) {
      if (!isAllowedFeedMediaUrl(line)) {
        return { error: "Each attachment must be a valid https URL or an uploaded file path." };
      }
      attachments.push({ url: line, kind: inferFeedAttachmentKind(line) });
    }
  }

  await prisma.feedPost.create({
    data: {
      authorId: session.user.id,
      body: parsed.data.body,
      ...(attachments.length > 0 ? { attachments: { create: attachments } } : {}),
    },
  });

  revalidatePath("/dashboard");
  return { success: "Post published." };
}

const commentSchema = z.object({
  postId: z.string().min(1),
  body: z.string().trim().min(1, "Comment cannot be empty.").max(2000, "Comment is too long."),
});

export async function createFeedComment(
  _prev: FeedActionState | undefined,
  formData: FormData,
): Promise<FeedActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to comment." };
  }

  const parsed = commentSchema.safeParse({
    postId: formData.get("postId"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid comment." };
  }

  const post = await prisma.feedPost.findUnique({
    where: { id: parsed.data.postId },
    select: { id: true },
  });
  if (!post) {
    return { error: "Post not found." };
  }

  await prisma.feedComment.create({
    data: {
      postId: parsed.data.postId,
      authorId: session.user.id,
      body: parsed.data.body,
    },
  });

  revalidatePath("/dashboard");
  return { success: "Comment added." };
}

const deletePostSchema = z.object({
  postId: z.string().min(1),
});

export async function deleteFeedPost(
  _prev: FeedActionState | undefined,
  formData: FormData,
): Promise<FeedActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not signed in." };
  }

  const parsed = deletePostSchema.safeParse({ postId: formData.get("postId") });
  if (!parsed.success) {
    return { error: "Invalid request." };
  }

  const post = await prisma.feedPost.findUnique({
    where: { id: parsed.data.postId },
    select: { authorId: true },
  });
  if (!post) {
    return { error: "Post not found." };
  }

  const isAdmin = session.user.role === "ADMIN";
  if (post.authorId !== session.user.id && !isAdmin) {
    return { error: "You can only delete your own posts." };
  }

  await prisma.feedPost.delete({ where: { id: parsed.data.postId } });
  revalidatePath("/dashboard");
  return { success: "Post removed." };
}
