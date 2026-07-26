import Image from "next/image";
import type { Person } from "@/types/person";
import { fullName } from "@/types/person";

const DECEASED_GRAYSCALE = 0.2; // 20% desaturation for deceased profiles

export function ProfileCard({ person }: { person: Person }) {
  const name = fullName(person);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={[
        "flex flex-col items-center gap-3 rounded-xl border p-4 text-center shadow-sm",
        person.isDeceased
          ? "border-amber-400 ring-2 ring-amber-400 ring-offset-2 ring-offset-background"
          : "border-neutral-200 dark:border-neutral-800",
      ].join(" ")}
      style={person.isDeceased ? { filter: `grayscale(${DECEASED_GRAYSCALE})` } : undefined}
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        {person.profilePhotoUrl ? (
          <Image
            src={person.profilePhotoUrl}
            alt={name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-neutral-500">
            {initials}
          </div>
        )}
      </div>

      <div>
        <p className="font-medium">{name}</p>
        {(person.birthDate || person.deathDate) && (
          <p className="text-sm text-neutral-500">
            {person.birthDate ?? "?"} – {person.isDeceased ? (person.deathDate ?? "?") : "present"}
          </p>
        )}
      </div>

      {person.bio && <p className="text-sm text-neutral-500">{person.bio}</p>}
    </div>
  );
}
