"use client";

import { signInWithOAuth } from "@/lib/auth";

export function SignInButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={() => signInWithOAuth("google")}
        className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
      >
        Continue with Google
      </button>
      <button
        disabled
        title="Facebook sign-in is pending Meta's app review"
        className="cursor-not-allowed rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-400 dark:border-neutral-700 dark:text-neutral-600"
      >
        Continue with Facebook (pending review)
      </button>
    </div>
  );
}
