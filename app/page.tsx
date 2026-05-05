import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex-1">
      <header className="sticky top-0 z-20 border-b border-indigo-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-slate-900">
            Aspire Entrepreneur
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
            <a href="#home" className="hover:text-slate-900">
              Home
            </a>
            <a href="#about" className="hover:text-slate-900">
              About
            </a>
            <a href="#impact" className="hover:text-slate-900">
              Impact
            </a>
            <a href="#roles" className="hover:text-slate-900">
              Roles
            </a>
            <a href="#contact" className="hover:text-slate-900">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="home" className="mx-auto w-full max-w-6xl px-6 py-12">
        <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-10 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-indigo-100">Final Year Project</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold md:text-4xl">
              Entrepreneurship Support Portal for Founders, Mentors, Investors, and Admins
            </h1>
            <p className="mt-4 max-w-3xl text-indigo-100">
              A shared digital workspace that helps startups connect with the right people faster,
              reduce hiring and mentorship friction, and make growth decisions with trust and clarity.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                  >
                    Start as new user
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-md border border-white/50 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Already have account
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="about" className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">What problem we solve</h2>
            <p className="mt-2 text-sm text-slate-600">
              Many startups struggle to find trusted mentors, hire the right talent, and access
              investors through one reliable channel.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">How the portal helps</h2>
            <p className="mt-2 text-sm text-slate-600">
              The platform centralizes discovery, profiles, requests, communication, and role-based
              workflows to reduce delays and improve matching quality.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Why it matters</h2>
            <p className="mt-2 text-sm text-slate-600">
              Better guidance and better hiring decisions can help startups survive early stages and
              scale with more confidence.
            </p>
          </div>
        </section>

        <section id="impact" className="mt-10 rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-900">How this project helps all users</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">For startups</p>
              <p className="mt-1">
                Find relevant mentors and investors, present startup details clearly, and track requests
                from one dashboard.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">For hiring challenges</p>
              <p className="mt-1">
                Reduce mismatch by letting founders evaluate expertise, domain fit, and availability
                before engaging.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">For guidance and mentorship</p>
              <p className="mt-1">
                Structured profiles and communication threads make mentor-founder collaboration
                organized and measurable.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">For trust and governance</p>
              <p className="mt-1">
                Admin oversight, verification paths, and role-based access help maintain platform
                quality and reduce abuse.
              </p>
            </div>
          </div>
        </section>

        <section id="roles" className="mt-10 rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Who can use this platform</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <p className="font-semibold text-indigo-800">Founder</p>
              <p className="mt-1 text-sm text-indigo-700">Create startup profile and request support.</p>
            </div>
            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
              <p className="font-semibold text-violet-800">Mentor</p>
              <p className="mt-1 text-sm text-violet-700">Share expertise and guide startup growth.</p>
            </div>
            <div className="rounded-xl border border-fuchsia-100 bg-fuchsia-50 p-4">
              <p className="font-semibold text-fuchsia-800">Investor</p>
              <p className="mt-1 text-sm text-fuchsia-700">
                Discover promising startups and engage directly.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-800">Admin</p>
              <p className="mt-1 text-sm text-slate-700">Moderate, verify, and keep the ecosystem healthy.</p>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-slate-900">Ready to explore the portal?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-600">
            Sign up to create your role-based account, or log in to continue to your dashboard.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Continue to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Sign up now
                </Link>
                <Link
                  href="/login"
                  className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-slate-600 md:flex-row">
          <p>© {new Date().getFullYear()} Aspire Entrepreneur - FYP Project</p>
          <p>
            Logged in user:{" "}
            <span className="font-medium text-slate-700">{session?.user?.email ?? "guest user"}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
