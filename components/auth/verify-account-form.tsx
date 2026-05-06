"use client";

import { useActionState } from "react";
import { verifyAccountAction } from "@/app/actions/verification";

const initialState = undefined;

type Props = {
  email?: string;
};

export function VerifyAccountForm({ email }: Props) {
  const [state, action, pending] = useActionState(verifyAccountAction, initialState);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <h1 className="text-2xl font-semibold text-slate-900">Verify your account</h1>
      <p className="text-sm text-slate-600">
        Enter the 6-digit email and phone codes sent to you. (For now, codes are logged in server output for demo.)
      </p>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={email}
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="emailCode" className="text-sm font-medium text-slate-700">
          Email code
        </label>
        <input
          id="emailCode"
          name="emailCode"
          required
          minLength={6}
          maxLength={6}
          placeholder="123456"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="phoneCode" className="text-sm font-medium text-slate-700">
          Phone code
        </label>
        <input
          id="phoneCode"
          name="phoneCode"
          required
          minLength={6}
          maxLength={6}
          placeholder="654321"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-700">{state.success}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-indigo-600 px-3 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Verifying..." : "Verify account"}
      </button>
    </form>
  );
}
