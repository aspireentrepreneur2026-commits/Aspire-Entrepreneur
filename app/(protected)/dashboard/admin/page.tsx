import Link from "next/link";
import { AdminUserRow, type AdminUserRowModel } from "@/components/admin/admin-user-row";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export default async function AdminDashboardPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string }>;
}>) {
  const session = await requireRole(["ADMIN"]);
  const q = ((await searchParams)?.q ?? "").trim();

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            { phoneNumber: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 250,
    include: {
      founderProfile: true,
      mentorProfile: true,
      investorProfile: true,
    },
  });

  const rows: AdminUserRowModel[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phoneNumber: u.phoneNumber,
    role: u.role,
    onboardingStatus: u.onboardingStatus,
    profileApprovalStatus: u.profileApprovalStatus,
    primaryGoal: u.primaryGoal,
    joinAim: u.joinAim,
    country: u.country,
    location: u.location,
    createdAt: u.createdAt.toISOString(),
    founderProfile: u.founderProfile
      ? {
          startupName: u.founderProfile.startupName,
          stage: u.founderProfile.stage,
          industry: u.founderProfile.industry,
          traction: u.founderProfile.traction,
        }
      : null,
    mentorProfile: u.mentorProfile
      ? { domainExpertise: u.mentorProfile.domainExpertise }
      : null,
    investorProfile: u.investorProfile
      ? { firmName: u.investorProfile.firmName }
      : null,
  }));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
        <p className="text-xs uppercase tracking-wide text-slate-500">Super admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Users</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Every account that signs up appears here. Adjust roles (founder, mentor, investor, admin) and
          onboarding stage. Open a user for full profile details including startup or investor data.
        </p>

        <form action="/dashboard/admin" method="get" className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <label htmlFor="q" className="text-sm font-medium text-slate-700">
              Search by name or email
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="e.g. name or email"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Search
            </button>
            {q ? (
              <Link
                href="/dashboard/admin"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Showing <strong className="text-slate-800">{rows.length}</strong> user
          {rows.length === 1 ? "" : "s"}
          {q ? (
            <>
              {" "}
              for &quot;{q}&quot;
            </>
          ) : null}
          .
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-[800px] w-full border-collapse text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-3">User</th>
                <th className="hidden px-3 py-3 md:table-cell">Profile hint</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Onboarding</th>
                <th className="hidden px-3 py-3 sm:table-cell">Profile</th>
                <th className="hidden px-3 py-3 lg:table-cell">Joined</th>
                <th className="px-3 py-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-500">
                    No users match this search.
                  </td>
                </tr>
              ) : (
                rows.map((user) => (
                  <AdminUserRow key={user.id} user={user} currentUserId={session.user.id} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Tip: log in as the seeded admin (<code className="rounded bg-slate-100 px-1">admin@entrepreneurship.local</code>{" "}
          / see your seed output) to access this page.
        </p>
      </div>
    </main>
  );
}
