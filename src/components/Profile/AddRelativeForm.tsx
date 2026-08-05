"use client";

import { useState } from "react";
import { addRelative } from "@/lib/actions";
import { fullName } from "@/types/person";
import type { Person } from "@/types/person";

export function AddRelativeForm({ people }: { people: Person[] }) {
  const [isDeceased, setIsDeceased] = useState(false);

  return (
    <form action={addRelative} className="flex w-full max-w-sm flex-col gap-3">
      <h2 className="text-lg font-semibold">Add a family member</h2>

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
        aria-label="Birth date"
        className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700"
      />

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
        <input
          name="deathDate"
          type="date"
          aria-label="Death date"
          className="rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700"
        />
      )}

      <div className="flex gap-2">
        <select
          name="relationshipType"
          required
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700"
        >
          <option value="child">is the child of</option>
          <option value="parent">is the parent of</option>
          <option value="sibling">is the sibling of</option>
          <option value="spouse">is the spouse of</option>
        </select>
        <select
          name="relativeToId"
          required
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-700"
        >
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
