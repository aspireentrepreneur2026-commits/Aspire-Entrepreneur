import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/session";

export default async function AdminPage() {
  await requireRole([UserRole.ADMIN]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <div className="rounded-xl border border-black/10 p-6">
        <h1 className="text-2xl font-semibold">Admin area</h1>
        <p className="mt-2 text-zinc-700">
          This page is role-protected and only accessible to users with the ADMIN role.
        </p>
      </div>
    </main>
  );
}
