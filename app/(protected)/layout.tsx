import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { DashboardCreateMenu } from "@/components/dashboard/dashboard-create-menu";
import { ExtendedProfileReminder } from "@/components/dashboard/extended-profile-reminder";
import { getRoleDashboardPath } from "@/lib/auth-redirect";
import { requireAuth } from "@/lib/session";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAuth();
  const workspaceHref = getRoleDashboardPath(session.user.role);
  const isAdmin = session.user.role === "ADMIN";
  const initial = session.user.name?.trim().charAt(0).toUpperCase() ?? "?";

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1128px] items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/dashboard" className="shrink-0 text-xl font-bold tracking-tight text-[#0a66c2]">
            aspire
          </Link>

          <Link
            href="/dashboard/discover"
            className="relative hidden min-w-0 max-w-md flex-1 items-center rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-left text-sm text-slate-500 shadow-sm transition hover:border-[#0a66c2]/40 hover:bg-white hover:text-slate-700 md:flex"
            aria-label="Open discover search — people, businesses, mentors, ideas"
          >
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
              🔍
            </span>
            <span className="truncate">Search people, businesses, mentors, ideas…</span>
          </Link>

          <nav className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/dashboard#feed-start"
              className="hidden rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:inline"
            >
              Home
            </Link>
            <Link
              href="/dashboard/ideas"
              className="hidden rounded-md px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:inline"
              title="Ideas workspace"
            >
              Ideas
            </Link>
            <Link
              href="/dashboard/discover"
              className="hidden rounded-md px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:inline"
              title="Discover — search & filters"
            >
              Discover
            </Link>
            <Link
              href="/dashboard/network"
              className="hidden rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:inline"
            >
              Network
            </Link>
            <Link
              href="/dashboard/business"
              className="hidden rounded-md px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 xl:inline"
              title="Business workspace"
            >
              Business
            </Link>
            <Link
              href="/settings"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-sm font-bold text-white hover:ring-2 hover:ring-[#0a66c2]/40"
              title="Settings & profile"
            >
              {initial}
            </Link>
            {isAdmin ? (
              <Link
                href="/dashboard/admin"
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Admin
              </Link>
            ) : null}
            <DashboardCreateMenu workspaceHref={workspaceHref} />
            <LogoutButton />
          </nav>
        </div>
      </header>
      <ExtendedProfileReminder />
      {children}
    </>
  );
}
