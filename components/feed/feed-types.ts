export type FeedCommentView = {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    founderProfile: { startupName: string } | null;
    investorProfile: { firmName: string } | null;
    mentorProfile: { domainExpertise: string } | null;
  };
};

export type FeedPostView = {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: string;
    founderProfile: { startupName: string } | null;
    investorProfile: { firmName: string } | null;
    mentorProfile: { domainExpertise: string } | null;
  };
  attachments: { id: string; url: string; kind: "IMAGE" | "VIDEO" | "LINK" }[];
  comments: FeedCommentView[];
};
