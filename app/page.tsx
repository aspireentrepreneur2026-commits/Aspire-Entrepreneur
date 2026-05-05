import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative flex-1 overflow-x-clip">
      <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-24 top-56 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl animate-pulse" />

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
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="home" className="mx-auto w-full max-w-6xl px-6 py-12">
        <section className="grid items-center gap-8 overflow-hidden rounded-3xl border border-indigo-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:grid-cols-2 md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-indigo-500">Final Year Project</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
              Smarter startup growth through one connected ecosystem
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              A visual and interactive platform where founders connect with mentors, investors, and
              admins to solve hiring friction, mentorship gaps, and trust challenges.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
                  >
                    Start as new user
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    Already have account
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-6">
            <div className="absolute -right-4 -top-4 rounded-xl border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
              Live ecosystem
            </div>
            <Image
              src="/globe.svg"
              alt="Global startup ecosystem"
              width={220}
              height={220}
              className="mx-auto animate-bounce"
            />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <p className="font-semibold text-slate-900">Founders</p>
              </div>
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <p className="font-semibold text-slate-900">Mentors</p>
              </div>
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <p className="font-semibold text-slate-900">Investors</p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "What problem we solve",
              text: "Startups often waste time finding the right people for hiring, fundraising, and strategic guidance.",
              icon: "/file.svg",
            },
            {
              title: "How the portal helps",
              text: "Everything sits in one place: profiles, startup information, requests, communication, and role-based access.",
              icon: "/window.svg",
            },
            {
              title: "Why it matters",
              text: "Faster and better connections increase startup survival, execution quality, and confidence for growth.",
              icon: "/next.svg",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Image src={item.icon} alt={item.title} width={28} height={28} className="h-7 w-7" />
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section id="impact" className="mt-10 rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-900">How this project helps all users</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["For startups", "Find mentors and investors, present startup details, and track requests in one dashboard."],
              ["For hiring challenges", "Reduce mismatches by filtering talent and experts based on role fit and availability."],
              ["For mentor-founder collaboration", "Keep mentorship requests, messages, and outcomes structured and trackable."],
              ["For trust and governance", "Use admin moderation and verification workflows for safer platform operations."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 transition hover:scale-[1.01]"
              >
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="mt-1">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="roles" className="mt-10 rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Who can use this platform</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 transition hover:-translate-y-1">
              <p className="font-semibold text-indigo-800">Founder</p>
              <p className="mt-1 text-sm text-indigo-700">Create startup profile, request support, and hire smarter.</p>
            </div>
            <div className="rounded-xl border border-violet-100 bg-violet-50 p-4 transition hover:-translate-y-1">
              <p className="font-semibold text-violet-800">Mentor</p>
              <p className="mt-1 text-sm text-violet-700">Offer strategic guidance and track startup progress.</p>
            </div>
            <div className="rounded-xl border border-fuchsia-100 bg-fuchsia-50 p-4 transition hover:-translate-y-1">
              <p className="font-semibold text-fuchsia-800">Investor</p>
              <p className="mt-1 text-sm text-fuchsia-700">Discover promising startups and engage with confidence.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1">
              <p className="font-semibold text-slate-800">Admin</p>
              <p className="mt-1 text-sm text-slate-700">Moderate platform quality, trust, and governance.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Ready to explore the portal?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-600">
            Sign up to create your role-based account, or log in to continue directly to your dashboard.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Continue to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  Sign up now
                </Link>
                <Link
                  href="/login"
                  className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-2 px-4 py-4 text-sm text-slate-600 md:flex-row">
          <p className="text-center">© {new Date().getFullYear()} Aspire Entrepreneur</p>
        </div>
      </footer>
    </div>
  );
}
