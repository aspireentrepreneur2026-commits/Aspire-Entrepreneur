import type { PrismaClient } from "@prisma/client";
import { OnboardingStatus, ProfileApprovalStatus, UserRole } from "@prisma/client";

const DEMO_COUNT = 50;

/** Stable portrait (square) per index — works as `<img src>` without Next remote config. */
function avatarUrl(i: number): string {
  const id = ((i - 1) % 70) + 1;
  return `https://i.pravatar.cc/400?img=${id}`;
}

/** Wide cover — Picsum seed keeps URLs stable across re-seeds. */
function coverUrl(i: number): string {
  return `https://picsum.photos/seed/aspire-cover-${i}/1280/420`;
}

const FIRST = [
  "Aarav", "Zara", "Omar", "Fatima", "Noah", "Layla", "Ibrahim", "Maya", "Yusuf", "Hana",
  "Leo", "Sofia", "Ethan", "Amira", "Lucas", "Nadia", "Mateo", "Yasmin", "Arjun", "Priya",
  "Kwame", "Aisha", "Chen", "Mei", "Jonas", "Elin", "Diego", "Camila", "Viktor", "Anastasia",
  "Sven", "Ingrid", "Hiro", "Yuki", "Liam", "Emma", "James", "Olivia", "Henry", "Chloe",
  "Daniel", "Grace", "Ryan", "Zoe", "Alex", "Nina", "Sam", "Rita", "Tom", "Eva",
] as const;

const LAST = [
  "Khan", "Hassan", "Rahman", "Malik", "Ahmed", "Siddiqui", "Ali", "Sheikh", "Farooq", "Qureshi",
  "Berg", "Lindqvist", "Nielsen", "Hansen", "Jensen", "Olsen", "Patel", "Sharma", "Verma", "Reddy",
  "Okafor", "Nwosu", "Mensah", "Diallo", "Santos", "Silva", "Costa", "Reyes", "Nguyen", "Tran",
  "Park", "Kim", "Tanaka", "Suzuki", "Novak", "Horvat", "Popescu", "Ionescu", "Kowalski", "Nowak",
  "Rossi", "Conti", "Murphy", "Walsh", "O'Neil", "Foster", "Brooks", "Hayes", "Cole", "West",
] as const;

const COUNTRY_LOC: { country: string; location: string }[] = [
  { country: "Pakistan", location: "Karachi, Sindh" },
  { country: "Pakistan", location: "Lahore, Punjab" },
  { country: "Pakistan", location: "Islamabad" },
  { country: "United Arab Emirates", location: "Dubai" },
  { country: "Saudi Arabia", location: "Riyadh" },
  { country: "Nigeria", location: "Lagos" },
  { country: "Kenya", location: "Nairobi" },
  { country: "Egypt", location: "Cairo" },
  { country: "United Kingdom", location: "London" },
  { country: "Germany", location: "Berlin" },
  { country: "France", location: "Paris" },
  { country: "Netherlands", location: "Amsterdam" },
  { country: "United States", location: "San Francisco, CA" },
  { country: "United States", location: "New York, NY" },
  { country: "United States", location: "Austin, TX" },
  { country: "Canada", location: "Toronto, ON" },
  { country: "India", location: "Bangalore, Karnataka" },
  { country: "India", location: "Mumbai, Maharashtra" },
  { country: "Singapore", location: "Singapore" },
  { country: "Australia", location: "Sydney, NSW" },
  { country: "Japan", location: "Tokyo" },
  { country: "South Korea", location: "Seoul" },
  { country: "Brazil", location: "São Paulo" },
  { country: "Mexico", location: "Mexico City" },
  { country: "Turkey", location: "Istanbul" },
];

const INDUSTRIES = [
  "Fintech / payments", "Healthtech / digital care", "Edtech", "Climate / cleantech", "Logistics & mobility",
  "Cybersecurity", "DevTools & infra", "E-commerce enablement", "AgriTech", "PropTech",
  "HR / workforce", "Legal tech", "Insurtech", "Gaming / interactive media", "AI / ML applications",
  "Industrial IoT", "Retail analytics", "Travel tech", "Marketplace", "Deep tech R&D",
];

const STAGES = ["Pre-seed", "Seed", "Seed+", "Series A", "Series B", "Bootstrapped", "Angel", "Growth"];

const TEAM_SIZES = ["1–5", "6–10", "11–20", "21–50", "51–100", "100+"];

const EXP = ["Junior", "Mid", "Senior", "Lead", "Principal"] as const;

function phoneForIndex(i: number): string {
  return `+1201691${String(i).padStart(4, "0")}`;
}

function founderExtras(startup: string, industry: string, leader: string) {
  return {
    industryExpertiseNarrative: `${leader} leads ${startup} in ${industry}, focusing on product-market fit, regulated markets, and repeatable enterprise sales. Deep work with design partners shaped the roadmap and compliance posture.`,
    studyWorkBackground: `Prior roles in product and partnerships at growth-stage B2B companies; coursework in CS and business; contributor to open-source tooling used by the team in production.`,
    achievements: `Shipped MVP in under two quarters; signed multiple paid pilots; invited speaker at two regional founder summits; filed provisional IP around core workflow automation.`,
    investmentCapital: `Capital-efficient to date with selective angel participation; cap table intentionally simple ahead of an institutional round.`,
    investmentInterest: `Seeking lead investors with experience scaling vertical SaaS and GTM in overlapping geographies; value hands-on support on enterprise procurement.`,
    investmentHistory: `Angel checks in two adjacent pre-seed companies (logistics and HR tech) through a trusted syndicate network.`,
  };
}

function mentorExtras(domain: string) {
  return {
    industryExpertiseNarrative: `Mentorship emphasis on ${domain}: roadmap clarity, hiring bar, technical debt tradeoffs, and board-ready metrics. Prefers structured sessions with clear goals and follow-up artifacts.`,
    studyWorkBackground: `Advanced degrees in a relevant discipline; leadership roles across product and engineering; board observer experience at two venture-backed companies.`,
    achievements: `Built and scaled teams past 100 engineers; multiple successful exits as operator; published thought leadership on GTM for technical products.`,
    investmentCapital: `Allocates a small portion of personal capital into founder-led rounds where there is strong alignment on ethics and market timing.`,
    investmentInterest: `Interested in backing exceptional teams in ${domain} where domain expertise materially changes outcomes.`,
    investmentHistory: `Participated in a dozen angel and scout investments across seed and Series A, with concentration in B2B software.`,
  };
}

function investorExtras(firm: string, sectors: string) {
  return {
    industryExpertiseNarrative: `${firm} evaluates opportunities in ${sectors} with a thesis-driven lens: durable differentiation, capital efficiency, and founder-market fit. Supports portfolio with intros and hiring.`,
    studyWorkBackground: `Partners bring backgrounds in investment banking, growth equity, and operator roles at category-defining companies.`,
    achievements: `Fund track record includes multiple up-rounds and two notable acquisitions; recognized in industry press for thesis work in frontier markets.`,
    investmentCapital: `Deploying committed capital from LPs with a disciplined reserve strategy for follow-ons through Series B.`,
    investmentInterest: `Actively sourcing companies where ${sectors} intersects with software margins and global expansion potential.`,
    investmentHistory: `Prior fund investments span seed through growth; notable exits in enterprise SaaS and infrastructure software.`,
  };
}

export async function seedBulkDemoUsers(prisma: PrismaClient, passwordHashDemo: string): Promise<void> {
  const now = new Date();
  const baseUser = {
    onboardingStatus: OnboardingStatus.COMPLETED,
    emailVerified: now,
    phoneVerifiedAt: now,
    extendedProfileCompletedAt: now,
    passwordHash: passwordHashDemo,
    profileApprovalStatus: ProfileApprovalStatus.APPROVED,
    profileApprovalNote: null as string | null,
  };

  for (let i = 1; i <= DEMO_COUNT; i++) {
    const email = `persona.${String(i).padStart(2, "0")}.demo@example.local`;
    const first = FIRST[(i - 1) % FIRST.length];
    const last = LAST[(i - 1) % LAST.length];
    const name = `${first} ${last}`;
    const loc = COUNTRY_LOC[(i - 1) % COUNTRY_LOC.length];
    const exp = EXP[(i - 1) % EXP.length];
    const linkedinUrl = `https://www.linkedin.com/in/demo-persona-${String(i).padStart(2, "0")}`;
    const joinAim =
      i % 3 === 0
        ? "Build a category-defining product and recruit a world-class team."
        : i % 3 === 1
          ? "Meet investors, mentors, and partners who understand regulated markets."
          : "Share lessons learned and pay forward support to the next cohort of founders.";
    const primaryGoal =
      i % 4 === 0
        ? "Raise institutional capital and expand into new regions."
        : i % 4 === 1
          ? "Hire senior engineers and ship enterprise-grade reliability."
          : i % 4 === 2
            ? "Establish design partnerships and repeatable GTM motion."
            : "Strengthen brand, community, and thought leadership in the space.";
    const aboutYourself = `${name} is a ${exp.toLowerCase()}-level operator based in ${loc.location}. Focused on high-integrity teams, measurable outcomes, and long-term relationships with customers and investors. Open to intros in overlapping networks.`;

    const image = avatarUrl(i);
    const coverImageUrl = coverUrl(i);

    if (i <= 18) {
      const role = UserRole.FOUNDER;
      const industry = INDUSTRIES[(i - 1) % INDUSTRIES.length];
      const stage = STAGES[(i - 1) % STAGES.length];
      const startupName = `${last}${first.slice(0, 3)} Labs`;
      const teamSize = TEAM_SIZES[(i - 1) % TEAM_SIZES.length];
      const fundingBand = i % 5 === 0 ? "$2M–$5M" : i % 5 === 1 ? "$250k–$750k" : i % 5 === 2 ? "$500k–$1.5M" : i % 5 === 3 ? "$100k–$300k" : "$750k–$2M";
      const fundingNeeded = `${stage} round · seeking ${fundingBand} for product, GTM, and key hires`;
      const traction = `ARR growing MoM; ${5 + (i % 8)} paying customers; NPS ${40 + (i % 20)} from design partner cohort.`;
      const fx = founderExtras(startupName, industry, name);

      await prisma.user.upsert({
        where: { email },
        update: {
          name,
          phoneNumber: phoneForIndex(i),
          country: loc.country,
          location: loc.location,
          joinAim,
          aboutYourself,
          experienceLevel: exp,
          linkedinUrl,
          primaryGoal,
          role,
          image,
          coverImageUrl,
          ...baseUser,
          founderProfile: {
            upsert: {
              create: {
                startupName,
                stage,
                industry,
                teamSize,
                traction,
                fundingNeeded,
                ...fx,
              },
              update: {
                startupName,
                stage,
                industry,
                teamSize,
                traction,
                fundingNeeded,
                ...fx,
              },
            },
          },
        },
        create: {
          name,
          email,
          phoneNumber: phoneForIndex(i),
          country: loc.country,
          location: loc.location,
          joinAim,
          aboutYourself,
          experienceLevel: exp,
          linkedinUrl,
          primaryGoal,
          role,
          image,
          coverImageUrl,
          ...baseUser,
          founderProfile: {
            create: {
              startupName,
              stage,
              industry,
              teamSize,
              traction,
              fundingNeeded,
              ...fx,
            },
          },
        },
      });
    } else if (i <= 34) {
      const role = UserRole.MENTOR;
      const domain = INDUSTRIES[(i + 3) % INDUSTRIES.length];
      const yearsExperience = 6 + (i % 22);
      const mx = mentorExtras(domain);

      await prisma.user.upsert({
        where: { email },
        update: {
          name,
          phoneNumber: phoneForIndex(i),
          country: loc.country,
          location: loc.location,
          joinAim,
          aboutYourself,
          experienceLevel: exp,
          linkedinUrl,
          primaryGoal,
          role,
          image,
          coverImageUrl,
          ...baseUser,
          mentorProfile: {
            upsert: {
              create: {
                yearsExperience,
                domainExpertise: `${domain}; GTM, hiring, and technical architecture for early-stage teams.`,
                pastCompanies: `Previously at ${["Northbridge Systems", "HelioWorks", "Vertex Labs", "BlueRiver AI"][(i - 1) % 4]} and two acquired startups.`,
                mentoringStyle: i % 2 === 0 ? "Weekly syncs plus async doc review." : "Biweekly deep dives with async Slack support.",
                availability: `${3 + (i % 5)} hours / week`,
                ...mx,
              },
              update: {
                yearsExperience,
                domainExpertise: `${domain}; GTM, hiring, and technical architecture for early-stage teams.`,
                pastCompanies: `Previously at ${["Northbridge Systems", "HelioWorks", "Vertex Labs", "BlueRiver AI"][(i - 1) % 4]} and two acquired startups.`,
                mentoringStyle: i % 2 === 0 ? "Weekly syncs plus async doc review." : "Biweekly deep dives with async Slack support.",
                availability: `${3 + (i % 5)} hours / week`,
                ...mx,
              },
            },
          },
        },
        create: {
          name,
          email,
          phoneNumber: phoneForIndex(i),
          country: loc.country,
          location: loc.location,
          joinAim,
          aboutYourself,
          experienceLevel: exp,
          linkedinUrl,
          primaryGoal,
          role,
          image,
          coverImageUrl,
          ...baseUser,
          mentorProfile: {
            create: {
              yearsExperience,
              domainExpertise: `${domain}; GTM, hiring, and technical architecture for early-stage teams.`,
              pastCompanies: `Previously at ${["Northbridge Systems", "HelioWorks", "Vertex Labs", "BlueRiver AI"][(i - 1) % 4]} and two acquired startups.`,
              mentoringStyle: i % 2 === 0 ? "Weekly syncs plus async doc review." : "Biweekly deep dives with async Slack support.",
              availability: `${3 + (i % 5)} hours / week`,
              ...mx,
            },
          },
        },
      });
    } else {
      const role = UserRole.INVESTOR;
      const sectors = INDUSTRIES[(i + 7) % INDUSTRIES.length];
      const firmName = `${last} Capital Partners`;
      const checkSizeRange =
        i % 4 === 0
          ? "$250k–$1M first cheque, up to $3M over the lifecycle"
          : i % 4 === 1
            ? "$500k–$2M lead or co-lead, reserves for follow-on"
            : i % 4 === 2
              ? "$1M–$5M early growth tickets"
              : "$100k–$500k pre-seed and seed scout checks";
      const investmentStage =
        i % 3 === 0 ? "Pre-seed, Seed" : i % 3 === 1 ? "Seed, Series A" : "Series A, Series B";
      const sectorsOfInterest = `${sectors}; B2B software; selective consumer infra`;
      const preferredGeography = `${loc.country}; opportunistic global`;
      const ix = investorExtras(firmName, sectors);

      await prisma.user.upsert({
        where: { email },
        update: {
          name,
          phoneNumber: phoneForIndex(i),
          country: loc.country,
          location: loc.location,
          joinAim,
          aboutYourself,
          experienceLevel: exp,
          linkedinUrl,
          primaryGoal,
          role,
          image,
          coverImageUrl,
          ...baseUser,
          investorProfile: {
            upsert: {
              create: {
                firmName,
                checkSizeRange,
                investmentStage,
                sectorsOfInterest,
                preferredGeography,
                ...ix,
              },
              update: {
                firmName,
                checkSizeRange,
                investmentStage,
                sectorsOfInterest,
                preferredGeography,
                ...ix,
              },
            },
          },
        },
        create: {
          name,
          email,
          phoneNumber: phoneForIndex(i),
          country: loc.country,
          location: loc.location,
          joinAim,
          aboutYourself,
          experienceLevel: exp,
          linkedinUrl,
          primaryGoal,
          role,
          image,
          coverImageUrl,
          ...baseUser,
          investorProfile: {
            create: {
              firmName,
              checkSizeRange,
              investmentStage,
              sectorsOfInterest,
              preferredGeography,
              ...ix,
            },
          },
        },
      });
    }
  }
}

export const BULK_DEMO_PASSWORD = "Demo1234";
