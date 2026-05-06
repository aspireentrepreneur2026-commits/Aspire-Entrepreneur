import { requireRole } from "@/lib/session";

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN"]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
        <p className="text-xs uppercase tracking-wide text-slate-500">Admin dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Platform control center</h1>
        <p className="mt-2 text-slate-600">
          Manage trust, moderation, and verification workflows from here.
        </p>
      </div>
    </main>
  );
}
