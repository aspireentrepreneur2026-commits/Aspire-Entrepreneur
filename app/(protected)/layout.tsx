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

          <label className="relative hidden min-w-0 max-w-md flex-1 md:block">
            <span className="sr-only">Search</span>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="search"
              readOnly
              placeholder="Search companies, people, posts (soon)"
              title="Coming soon"
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0a66c2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]/20"
            />
          </label>

          <nav className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/dashboard#feed-start"
              className="hidden rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:inline"
            >
              Home
            </Link>
            <Link
              href="/dashboard#ideas-hub"
              className="hidden rounded-md px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:inline"
              title="Ideas & validation"
            >
              Ideas
            </Link>
            <Link
              href="/dashboard#new-business-spotlight"
              className="hidden rounded-md px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:inline"
              title="New businesses & SMEs"
            >
              Business
            </Link>
            <Link
              href="/dashboard#network-members"
              className="hidden rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:inline"
            >
              Network
            </Link>
            <Link
              href="/dashboard#startups"
              className="hidden rounded-md px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 xl:inline"
              title="Startups"
            >
              Startups
            </Link>
            <button
              type="button"
              disabled
              title="Video hub — coming soon"
              className="hidden cursor-not-allowed rounded-md px-2 py-2 text-sm text-slate-400 xl:inline"
            >
              🎬 <span className="sr-only">Videos</span>
            </button>
            <button
              type="button"
              disabled
              title="Marketplace for founders — coming soon"
              className="hidden cursor-not-allowed rounded-md px-2 py-2 text-sm text-slate-400 2xl:inline"
            >
              🛒 <span className="sr-only">Marketplace</span>
            </button>
            <button
              type="button"
              disabled
              title="Messaging — coming soon"
              className="hidden cursor-not-allowed rounded-md px-2 py-2 text-sm text-slate-400 xl:inline"
            >
              💬
            </button>
            <button
              type="button"
              disabled
              title="Notifications — coming soon"
              className="relative hidden cursor-not-allowed rounded-md px-2 py-2 text-sm text-slate-400 xl:inline"
            >
              🔔
            </button>
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
