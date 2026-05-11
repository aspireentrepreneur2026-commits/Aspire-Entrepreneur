import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

/**
 * `pg` warns when `sslmode` is require/prefer/verify-ca (today they behave like verify-full).
 * Setting verify-full explicitly keeps that behavior and avoids the console warning before pg v9.
 */
function databaseUrlForPgAdapter(urlString: string): string {
  try {
    const url = new URL(urlString);
    const mode = url.searchParams.get("sslmode");
    if (mode === "require" || mode === "prefer" || mode === "verify-ca") {
      url.searchParams.set("sslmode", "verify-full");
      return url.href;
    }
  } catch {
    // Non-URL strings (e.g. some proxies) — use as-is
  }
  return urlString;
}

const adapter = new PrismaPg({ connectionString: databaseUrlForPgAdapter(connectionString) });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

globalForPrisma.prisma = prisma;
