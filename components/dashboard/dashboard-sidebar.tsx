import Link from "next/link";

type Props = {
  userName: string;
  headline: string;
  myDashboardHref: string;
  isAdmin: boolean;
  onboardingStatus?: string | null;
};

function NavIcon({ children }: { children: React.ReactNode }) {
  return <span className="text-lg leading-none">{children}</span>;
}

export function DashboardSidebar({
  userName,
  headline,
  myDashboardHref,
  isAdmin,
  onboardingStatus,
}: Props) {
  const initial = userName.trim().charAt(0).toUpperCase() || "?";
  const needsOnboarding =
    onboardingStatus === "BASIC" || onboardingStatus === "ROLE_PROFILE";

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[5.75rem] space-y-2">
        <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm">
          <div className="h-14 bg-gradient-to-r from-[#0a66c2] to-[#004182]" />
          <div className="relative px-3 pb-4 pt-0">
            <div className="-mt-8 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-semibold text-white shadow-md">
              {initial}
            </div>
            <Link
              href="/settings"
              className="mt-3 block text-center text-[15px] font-semibold text-slate-900 hover:text-[#0a66c2] hover:underline"
            >
              {userName}
            </Link>
            <p className="mt-1 line-clamp-2 text-center text-xs text-slate-600">{headline}</p>
            {needsOnboarding ? (
              <Link
                href="/onboarding"
                className="mt-3 block rounded-full bg-amber-50 py-2 text-center text-xs font-semibold text-amber-900 ring-1 ring-amber-200 hover:bg-amber-100"
              >
                Finish your profile →
              </Link>
            ) : (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <Link
                  href={myDashboardHref}
                  className="flex justify-between text-xs font-medium text-slate-700 hover:text-[#0a66c2]"
                >
                  <span>Workspace</span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <nav className="overflow-hidden rounded-lg border border-slate-200/80 bg-white py-2 text-sm shadow-sm">
          <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Shortcuts</p>
          <NavRow href="/dashboard#feed-start" icon={<NavIcon>🏠</NavIcon>} label="Home feed" />
          <NavRow href="/dashboard/network" icon={<NavIcon>👥</NavIcon>} label="Member network" />
          <NavRow href="/members/me" icon={<NavIcon>🪪</NavIcon>} label="My profile" />
          <NavRow href={myDashboardHref} icon={<NavIcon>📊</NavIcon>} label="My dashboard" />
          <NavRow href="/settings" icon={<NavIcon>⚙️</NavIcon>} label="Settings" />
          {isAdmin ? (
            <NavRow href="/dashboard/admin" icon={<NavIcon>🛡️</NavIcon>} label="Admin" />
          ) : null}

          <div className="mx-4 my-2 border-t border-dashed border-slate-100" />
          <p className="px-4 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Discover &amp; workspaces
          </p>
          <NavRow href="/dashboard/discover" icon={<NavIcon>🔍</NavIcon>} label="Discover" />
          <NavRow href="/dashboard/ideas" icon={<NavIcon>💡</NavIcon>} label="Ideas workspace" />
          <NavRow href="/dashboard/business" icon={<NavIcon>💼</NavIcon>} label="Business workspace" />
          <NavRow href="/dashboard/ideas#new-business-spotlight" icon={<NavIcon>🏪</NavIcon>} label="New business" />
          <NavRow href="/dashboard/ideas#funding-desk" icon={<NavIcon>💰</NavIcon>} label="Funding desk" />
          <NavRow href="/dashboard/ideas#mentorship-lab" icon={<NavIcon>🎓</NavIcon>} label="Mentorship" />
          <NavRow href="/dashboard/ideas#learning-grow" icon={<NavIcon>📚</NavIcon>} label="Learning & playbooks" />
          <NavRow href="/onboarding" icon={<NavIcon>✨</NavIcon>} label="Profile wizard" />
        </nav>
      </div>
    </aside>
  );
}

function NavRow({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0a66c2]"
    >
      <span className="w-6 text-center">{icon}</span>
      {label}
    </Link>
  );
}
