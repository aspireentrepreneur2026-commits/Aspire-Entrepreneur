import Link from "next/link";
import { requireAuth } from "@/lib/session";

export default async function BusinessWorkspacePage() {
  await requireAuth();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-6 sm:px-6">
      <Link href="/dashboard" className="text-sm font-medium text-[#0a66c2] hover:underline">
        ← Back to home feed
      </Link>

      <header className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0a66c2]">Business workspace</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Business, SMEs &amp; growth</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          The <strong className="font-semibold text-slate-800">Founder &amp; SME toolkit</strong> cards (new
          businesses, funding, mentorship, business spotlight) now live on the{" "}
          <Link href="/dashboard/ideas#founder-sme-toolkit" className="font-semibold text-[#0a66c2] hover:underline">
            Ideas workspace
          </Link>{" "}
          so this page stays a lightweight entry point.
        </p>
      </header>

      <ul className="mt-10 space-y-3 text-sm text-slate-700">
        <li>
          <Link
            href="/dashboard/ideas#founder-sme-toolkit"
            className="font-semibold text-[#0a66c2] hover:underline"
          >
            Open Founder &amp; SME toolkit →
          </Link>
          <span className="text-slate-500"> — funding, mentorship, new business, and business cards.</span>
        </li>
        <li>
          <Link href="/dashboard/discover" className="font-semibold text-[#0a66c2] hover:underline">
            Open Discover →
          </Link>
          <span className="text-slate-500"> — search people, businesses, mentors, and ideas.</span>
        </li>
        <li>
          <Link href="/dashboard/network" className="font-semibold text-[#0a66c2] hover:underline">
            Open Member network →
          </Link>
        </li>
      </ul>
    </main>
  );
}
