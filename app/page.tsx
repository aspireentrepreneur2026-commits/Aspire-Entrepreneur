import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
      <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-indigo-100">Hamza FYP</p>
          <h1 className="mt-2 text-3xl font-semibold">Entrepreneurship Support Portal</h1>
          <p className="mt-3 max-w-2xl text-indigo-100">
            A clean starting point for founders, mentors, and investors with module-wise growth.
          </p>
        </div>

        <div className="p-8">
          <p className="max-w-2xl text-slate-600">
            Module 1 includes credentials auth, role-aware routes, dashboard access control, and
            profile settings.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-indigo-200 bg-white px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-50"
              >
                Register
              </Link>
            </>
          )}
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Signed in as: <span className="font-medium">{session?.user?.email ?? "guest"}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
