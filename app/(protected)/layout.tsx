import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAuth } from "@/lib/session";

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAuth();
  const isAdmin = session.user.role === "ADMIN";

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-indigo-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="font-semibold text-slate-900">
              Aspire Entrepreneur
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/settings" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Settings
            </Link>
            {isAdmin ? (
              <Link href="/dashboard/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Admin
              </Link>
            ) : null}
          </div>
          <LogoutButton />
        </div>
      </header>
      {children}
    </>
  );
}
