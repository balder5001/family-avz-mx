import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
    <Card
      className={cn(
        "w-full max-w-xs text-center",
        person.isDeceased && "border-amber-400 ring-2 ring-amber-400 ring-offset-2 ring-offset-background",
      )}
      style={person.isDeceased ? { filter: `grayscale(${DECEASED_GRAYSCALE})` } : undefined}
    >
      <CardContent className="flex flex-col items-center gap-3">
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
          {person.profilePhotoUrl ? (
            <Image src={person.profilePhotoUrl} alt={name} fill sizes="80px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
              {initials}
            </div>
          )}
        </div>

        <div>
          <p className="font-medium">{name}</p>
          {(person.birthDate || person.deathDate) && (
            <p className="text-sm text-muted-foreground">
              {person.birthDate ?? "?"} – {person.isDeceased ? (person.deathDate ?? "?") : "present"}
            </p>
          )}
        </div>

        {person.bio && <p className="text-sm text-muted-foreground">{person.bio}</p>}
      </CardContent>
    </Card>
  );
}
