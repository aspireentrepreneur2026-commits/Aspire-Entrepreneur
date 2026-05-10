import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#0b1220] text-white lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-8 shadow-2xl">
          <p className="mb-6 text-2xl font-semibold text-cyan-400">Aspire Entrepreneur</p>
          <RegisterForm />
          <p className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-cyan-400 underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <section className="hidden items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-12 lg:flex">
        <div className="max-w-lg text-center">
          <p className="text-left text-sm uppercase tracking-[0.18em] text-cyan-300">Aspire Entrepreneur</p>
          <h2 className="mt-3 text-left text-4xl font-semibold leading-tight">
            Build startups and launch new businesses in one trusted platform.
          </h2>
          <p className="mt-4 text-left text-slate-300">
            Create your profile, complete onboarding, and connect with the right ecosystem.
          </p>
        </div>
      </section>
    </main>
  );
}
