import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#0b1220] px-4 py-8 text-white lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-800 bg-[#0f172a] p-4 shadow-2xl lg:p-6">
        <p className="mb-4 text-2xl font-semibold text-indigo-300">Aspire Entrepreneur</p>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-cyan-400 underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
