import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <RegisterForm />
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-700 underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
