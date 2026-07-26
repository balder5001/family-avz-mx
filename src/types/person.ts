export interface Person {
  id: string;
  familyId: string;
  userId?: string | null;

  firstName: string;
  lastName?: string | null;
  bio?: string | null;
  education?: string | null;
  birthDate?: string | null; // ISO date
  deathDate?: string | null; // ISO date
  isDeceased: boolean;

  phoneNumber?: string | null;

  profilePhotoUrl?: string | null;
  nodeColor?: string | null;

  instagramUrl?: string | null;
  facebookUrl?: string | null;
  googleUrl?: string | null;
}

export function fullName(person: Pick<Person, "firstName" | "lastName">): string {
  return [person.firstName, person.lastName].filter(Boolean).join(" ");
}
