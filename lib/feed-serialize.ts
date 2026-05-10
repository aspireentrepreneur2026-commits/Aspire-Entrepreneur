import type { FeedPostView } from "@/components/feed/feed-types";
import type { Prisma } from "@prisma/client";

const authorSelect = {
  id: true,
  name: true,
  role: true,
  founderProfile: { select: { startupName: true } },
  investorProfile: { select: { firmName: true } },
  mentorProfile: { select: { domainExpertise: true } },
} as const;

const commentAuthorSelect = {
  id: true,
  name: true,
  founderProfile: { select: { startupName: true } },
  investorProfile: { select: { firmName: true } },
  mentorProfile: { select: { domainExpertise: true } },
} as const;

export const feedPostInclude = {
  attachments: true,
  author: { select: authorSelect },
  comments: {
    orderBy: { createdAt: "asc" as const },
    include: { author: { select: commentAuthorSelect } },
  },
} satisfies Prisma.FeedPostInclude;

export type FeedPostLoaded = Prisma.FeedPostGetPayload<{ include: typeof feedPostInclude }>;

export function toFeedPostView(p: FeedPostLoaded): FeedPostView {
  return {
    id: p.id,
    body: p.body,
    createdAt: p.createdAt.toISOString(),
    author: {
      id: p.author.id,
      name: p.author.name,
      role: p.author.role,
      founderProfile: p.author.founderProfile,
      investorProfile: p.author.investorProfile,
      mentorProfile: p.author.mentorProfile,
    },
    attachments: p.attachments.map((a) => ({
      id: a.id,
      url: a.url,
      kind: a.kind,
    })),
    comments: p.comments.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt.toISOString(),
      author: {
        id: c.author.id,
        name: c.author.name,
        founderProfile: c.author.founderProfile,
        investorProfile: c.author.investorProfile,
        mentorProfile: c.author.mentorProfile,
      },
    })),
  };
}
