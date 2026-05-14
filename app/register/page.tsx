import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#0b1220] text-white lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.45fr)] xl:grid-cols-[minmax(0,1.65fr)_minmax(0,0.38fr)]">
      <section className="flex items-start justify-center px-4 py-10 sm:px-8 lg:items-center lg:px-10 lg:py-12">
        <div className="w-full max-w-3xl xl:max-w-4xl rounded-2xl border border-slate-800/90 bg-[#0f172a]/95 p-6 shadow-2xl shadow-black/40 sm:p-8 lg:p-10">
          <p className="mb-2 text-2xl font-semibold tracking-tight text-cyan-400">Aspire Entrepreneur</p>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-400">
            Three quick steps: your contact details, how you join (entrepreneur vs new startups and your exact path),
            then LinkedIn and a short profile so we can match you well.
          </p>
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-cyan-400 underline underline-offset-2 hover:text-cyan-300">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <section className="hidden flex-col justify-center border-l border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/50 p-8 lg:flex lg:max-w-none xl:p-10">
        <div className="mx-auto max-w-xs text-left xl:max-w-[17rem]">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">Aspire Entrepreneur</p>
          <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-tight xl:text-3xl">
            One signup, questions that match how you join.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Pick entrepreneur (roles) or new startups (ventures) first, then your path — mentors, investors, founders,
            and builders each see the fields that fit.
          </p>
        </div>
      </section>
    </main>
  );
}
