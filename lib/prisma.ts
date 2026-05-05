import * as PrismaClientPkg from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type PrismaClientLike = Record<string, unknown>;
type PrismaClientOptions = {
  adapter: PrismaPg;
  log: string[];
};

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientLike;
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

const adapter = new PrismaPg({ connectionString });
const PrismaClientCtor = (
  PrismaClientPkg as { PrismaClient?: new (options?: PrismaClientOptions) => PrismaClientLike }
).PrismaClient;

if (!PrismaClientCtor) {
  throw new Error(
    "PrismaClient export is missing. Ensure `prisma generate` runs during build.",
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClientCtor({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
