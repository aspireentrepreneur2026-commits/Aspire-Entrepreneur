import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";

export default async function MemberMeRedirectPage() {
  const session = await requireAuth();
  redirect(`/members/${session.user.id}`);
}
