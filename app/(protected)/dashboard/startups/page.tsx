import { redirect } from "next/navigation";

/** Old URL — bookmarks and external links still use `/dashboard/startups`. */
export default function LegacyStartupsWorkspaceRedirect() {
  redirect("/dashboard/business");
}
