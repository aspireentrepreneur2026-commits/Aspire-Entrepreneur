import { prisma } from "@/lib/prisma";
import { UpdateProfileForm } from "@/components/auth/update-profile-form";
import { requireAuth } from "@/lib/session";

export default async function SettingsPage() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, role: true, email: true },
  });

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="mb-6 overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <h1 className="text-2xl font-semibold">Account settings</h1>
          <p className="mt-1 text-indigo-100">Manage your basic profile details.</p>
        </div>
        <div className="space-y-1 p-6 text-sm text-slate-700">
          <p>
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
          <p>
            Role: <span className="font-medium">{user.role}</span>
          </p>
        </div>
      </div>
      <UpdateProfileForm currentName={user.name} />
    </main>
  );
}
