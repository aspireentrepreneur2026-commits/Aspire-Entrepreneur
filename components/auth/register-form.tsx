"use client";

import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";

const initialState = undefined;

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="text-sm text-slate-600">Join the platform and pick your role to get started.</p>

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Full name
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>

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

      <div className="space-y-1">
        <label htmlFor="role" className="text-sm font-medium text-slate-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          required
          defaultValue="FOUNDER"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        >
          <option value="FOUNDER">Founder</option>
          <option value="MENTOR">Mentor</option>
          <option value="INVESTOR">Investor</option>
        </select>
      </div>

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-indigo-600 px-3 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
