import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";
import { getRoleDashboardPath } from "@/lib/auth-redirect";

export default async function DashboardPage() {
  const session = await requireAuth();
  redirect(getRoleDashboardPath(session.user.role));
}
