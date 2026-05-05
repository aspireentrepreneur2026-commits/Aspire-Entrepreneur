import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <LoginForm />
      <p className="mt-4 text-center text-sm text-slate-600">
        New here?{" "}
        <Link href="/register" className="font-medium text-indigo-700 underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
