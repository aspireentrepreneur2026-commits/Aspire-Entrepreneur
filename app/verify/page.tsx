import Link from "next/link";
import { VerifyAccountForm } from "@/components/auth/verify-account-form";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const emailValue = params.email;
  const email = Array.isArray(emailValue) ? emailValue[0] : emailValue;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <VerifyAccountForm email={email} />
      <p className="mt-4 text-center text-sm text-slate-600">
        Already verified?{" "}
        <Link href="/login" className="font-medium text-indigo-700 underline">
          Login now
        </Link>
      </p>
    </main>
  );
}
