export type FeedAuthorNames = {
  name: string;
  founderProfile: { startupName: string } | null;
  mentorProfile: { domainExpertise: string } | null;
  investorProfile: { firmName: string } | null;
};

/** Company / org line shown under the member name on the feed. */
export function feedAuthorSubtitle(author: FeedAuthorNames): string {
  if (author.founderProfile?.startupName) {
    return author.founderProfile.startupName;
  }
  if (author.investorProfile?.firmName) {
    return author.investorProfile.firmName;
  }
  if (author.mentorProfile?.domainExpertise) {
    return `Mentor · ${author.mentorProfile.domainExpertise}`;
  }
  return "Aspire Entrepreneur member";
}
