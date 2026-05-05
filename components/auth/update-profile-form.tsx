"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/auth";

type Props = {
  currentName: string;
};

const initialState = undefined;

export function UpdateProfileForm({ currentName }: Props) {
  const [state, action, pending] = useActionState(updateProfileAction, initialState);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-indigo-100 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
    >
      <h2 className="text-xl font-semibold text-slate-900">Profile settings</h2>
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Display name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={currentName}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500"
        />
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-green-700">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
