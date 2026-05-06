import bcrypt from "bcryptjs";
import { OnboardingStatus, PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const email = "admin@entrepreneurship.local";
  const passwordHash = await bcrypt.hash("Admin1234", 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: "Platform Admin",
      role: UserRole.ADMIN,
      onboardingStatus: OnboardingStatus.COMPLETED,
      passwordHash,
    },
    create: {
      name: "Platform Admin",
      email,
      role: UserRole.ADMIN,
      onboardingStatus: OnboardingStatus.COMPLETED,
      passwordHash,
    },
  });

  console.log("Seed complete.");
  console.log("Admin login:", email);
  console.log("Admin password: Admin1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
