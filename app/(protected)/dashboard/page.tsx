import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true, email: true },
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-indigo-100">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold">Welcome back, {user?.name ?? session.user.name}</h1>
          <p className="mt-2 text-indigo-100">
            Track your account status and quickly jump to core founder workflows.
          </p>
        </div>

        <div className="grid gap-4 p-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {user?.role ?? session.user.role ?? "FOUNDER"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:col-span-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-2 break-all text-lg font-semibold text-slate-900">
              {user?.email ?? session.user.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 px-8 pb-8">
          <Link
            href="/settings"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Edit profile settings
          </Link>
          <Link
            href="/admin"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Open admin area
          </Link>
        </div>
      </div>
    </main>
  );
}
