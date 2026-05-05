import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { auth } from "@/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  if (!session.user.role || !allowedRoles.includes(session.user.role)) {
    redirect("/dashboard");
  }
  return session;
}
