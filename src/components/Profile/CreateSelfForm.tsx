"use client";

import { createSelfProfile } from "@/lib/actions";

const inputClass =
  "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500";

export function CreateSelfForm() {
  return (
    <form action={createSelfProfile} className="flex w-full max-w-sm flex-col gap-3">
      <h1 className="text-xl font-semibold">Create your profile</h1>
      <p className="text-sm text-neutral-500">
        This becomes your spot in the family tree.
      </p>
      <input name="firstName" placeholder="First name" required className={inputClass} />
      <input name="lastName" placeholder="Last name" className={inputClass} />
      <input name="birthDate" type="date" className={inputClass} />
      <textarea name="bio" placeholder="Short bio" rows={3} className={inputClass} />
      <button
        type="submit"
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        Create profile
      </button>
    </form>
  );
}
