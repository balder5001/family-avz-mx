"use client";

import { createSelfProfile } from "@/lib/actions";

export function CreateSelfForm() {
  return (
    <form action={createSelfProfile} className="flex w-full max-w-sm flex-col gap-3">
      <h1 className="text-xl font-semibold">Create your profile</h1>
      <p className="text-sm text-neutral-500">
        This becomes your spot in the family tree.
      </p>
      <input
        name="firstName"
        placeholder="First name"
        required
        className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700"
      />
      <input
        name="lastName"
        placeholder="Last name"
        className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700"
      />
      <input
        name="birthDate"
        type="date"
        className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700"
      />
      <textarea
        name="bio"
        placeholder="Short bio"
        rows={3}
        className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700"
      />
      <button
        type="submit"
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        Create profile
      </button>
    </form>
  );
}
