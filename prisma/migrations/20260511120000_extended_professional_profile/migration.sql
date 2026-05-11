-- AlterTable
ALTER TABLE "User" ADD COLUMN "extendedProfileCompletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FounderProfile" ADD COLUMN     "industryExpertiseNarrative" TEXT,
ADD COLUMN     "studyWorkBackground" TEXT,
ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "investmentCapital" TEXT,
ADD COLUMN     "investmentInterest" TEXT,
ADD COLUMN     "investmentHistory" TEXT;

-- AlterTable
ALTER TABLE "MentorProfile" ADD COLUMN     "industryExpertiseNarrative" TEXT,
ADD COLUMN     "studyWorkBackground" TEXT,
ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "investmentCapital" TEXT,
ADD COLUMN     "investmentInterest" TEXT,
ADD COLUMN     "investmentHistory" TEXT;

-- AlterTable
ALTER TABLE "InvestorProfile" ADD COLUMN     "industryExpertiseNarrative" TEXT,
ADD COLUMN     "studyWorkBackground" TEXT,
ADD COLUMN     "achievements" TEXT,
ADD COLUMN     "investmentCapital" TEXT,
ADD COLUMN     "investmentInterest" TEXT,
ADD COLUMN     "investmentHistory" TEXT;
