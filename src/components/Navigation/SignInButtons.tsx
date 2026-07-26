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
        onClick={() => signInWithOAuth("facebook")}
        className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
      >
        Continue with Facebook
      </button>
    </div>
  );
}
