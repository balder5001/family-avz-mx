"use client";

import { updateOwnProfile } from "@/lib/actions";
import type { Person } from "@/types/person";

const inputClass =
  "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500";

export function EditProfileForm({ person }: { person: Person }) {
  return (
    <form action={updateOwnProfile} className="flex w-full max-w-sm flex-col gap-3">
      <h2 className="text-lg font-semibold">Edit your info</h2>

      <textarea
        name="bio"
        placeholder="Short bio"
        rows={3}
        defaultValue={person.bio ?? ""}
        className={inputClass}
      />
      <input
        name="education"
        placeholder="Education"
        defaultValue={person.education ?? ""}
        className={inputClass}
      />
      <input
        name="phoneNumber"
        placeholder="Phone number"
        defaultValue={person.phoneNumber ?? ""}
        className={inputClass}
      />
      <input
        name="instagramUrl"
        placeholder="Instagram URL"
        defaultValue={person.instagramUrl ?? ""}
        className={inputClass}
      />
      <input
        name="facebookUrl"
        placeholder="Facebook URL"
        defaultValue={person.facebookUrl ?? ""}
        className={inputClass}
      />
      <input
        name="googleUrl"
        placeholder="Google/website URL"
        defaultValue={person.googleUrl ?? ""}
        className={inputClass}
      />

      <button
        type="submit"
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        Save
      </button>
    </form>
  );
}
