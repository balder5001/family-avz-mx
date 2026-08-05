"use client";

import { useState } from "react";
import { addRelative } from "@/lib/actions";
import { fullName } from "@/types/person";
import type { Person } from "@/types/person";

const inputClass =
  "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500";

export function AddRelativeForm({ people }: { people: Person[] }) {
  const [isDeceased, setIsDeceased] = useState(false);

  return (
    <form action={addRelative} className="flex w-full max-w-sm flex-col gap-3">
      <h2 className="text-lg font-semibold">Add a family member</h2>

      <input name="firstName" placeholder="First name" required className={inputClass} />
      <input name="lastName" placeholder="Last name" className={inputClass} />
      <input name="birthDate" type="date" aria-label="Birth date" className={inputClass} />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isDeceased"
          checked={isDeceased}
          onChange={(e) => setIsDeceased(e.target.checked)}
        />
        Deceased
      </label>
      {isDeceased && (
        <input name="deathDate" type="date" aria-label="Death date" className={inputClass} />
      )}

      <div className="flex gap-2">
        <select name="relationshipType" required className={`flex-1 ${inputClass}`}>
          <option value="child">is the child of</option>
          <option value="parent">is the parent of</option>
          <option value="sibling">is the sibling of</option>
          <option value="spouse">is the spouse of</option>
        </select>
        <select name="relativeToId" required className={`flex-1 ${inputClass}`}>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {fullName(person)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        Add to tree
      </button>
    </form>
  );
}
