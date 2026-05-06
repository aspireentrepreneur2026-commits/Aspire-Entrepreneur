import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#0b1220] text-white lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0f172a] p-8 shadow-2xl">
          <p className="mb-6 text-2xl font-semibold text-cyan-400">Aspire Entrepreneur</p>
          <LoginForm />
          <p className="mt-4 text-center text-sm text-slate-400">
            New here?{" "}
            <Link href="/register" className="font-medium text-cyan-400 underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>

      <section className="hidden items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-12 lg:flex">
        <div className="max-w-lg text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Aspire Entrepreneur</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight">
            Connect startups with mentors and investors in one trusted platform.
          </h2>
          <p className="mt-4 text-slate-300">
            Build your profile, unlock opportunities, and collaborate with the right ecosystem.
          </p>
          <div className="mt-8 flex justify-center">
            <Image src="/globe.svg" alt="Aspire ecosystem" width={220} height={220} />
          </div>
        </div>
      </section>
    </main>
  );
}
