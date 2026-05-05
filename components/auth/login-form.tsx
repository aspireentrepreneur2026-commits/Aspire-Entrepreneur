"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";

const initialState = undefined;

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
      <p className="text-sm text-slate-600">Access your founder, mentor, or investor account.</p>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-indigo-600 px-3 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
