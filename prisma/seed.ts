import bcrypt from "bcryptjs";
import { OnboardingStatus, PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { BULK_DEMO_PASSWORD, seedBulkDemoUsers } from "./seed-bulk-demo";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const adminEmail = "admin@entrepreneurship.local";
  const passwordHashAdmin = await bcrypt.hash("Admin1234", 10);
  const passwordHashDemo = await bcrypt.hash(BULK_DEMO_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Platform Admin",
      phoneNumber: "+10000000000",
      country: "Pakistan",
      location: "Lahore",
      joinAim: "Manage and moderate platform quality.",
      aboutYourself: "System administrator for Aspire Entrepreneur platform.",
      experienceLevel: "Senior",
      primaryGoal: "Platform governance",
      role: UserRole.ADMIN,
      onboardingStatus: OnboardingStatus.COMPLETED,
      emailVerified: new Date(),
      phoneVerifiedAt: new Date(),
      passwordHash: passwordHashAdmin,
    },
    create: {
      name: "Platform Admin",
      email: adminEmail,
      phoneNumber: "+10000000000",
      country: "Pakistan",
      location: "Lahore",
      joinAim: "Manage and moderate platform quality.",
      aboutYourself: "System administrator for Aspire Entrepreneur platform.",
      experienceLevel: "Senior",
      primaryGoal: "Platform governance",
      role: UserRole.ADMIN,
      onboardingStatus: OnboardingStatus.COMPLETED,
      emailVerified: new Date(),
      phoneVerifiedAt: new Date(),
      passwordHash: passwordHashAdmin,
    },
  });

  await seedBulkDemoUsers(prisma, passwordHashDemo);

  console.log("Seed complete.");
  console.log("Admin:", adminEmail, "/ Admin1234");
  console.log(`50 demo members: persona.01.demo@example.local … persona.50.demo@example.local / ${BULK_DEMO_PASSWORD}`);
  console.log("Mix: 18 founders, 16 mentors, 16 investors — avatar (pravatar.cc), cover (picsum), all profile text fields filled.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
