import { ProfileCard } from "@/components/Profile/ProfileCard";
import { SignInButtons } from "@/components/Navigation/SignInButtons";
import type { Person } from "@/types/person";

const samplePeople: Person[] = [
  {
    id: "1",
    familyId: "demo",
    firstName: "Ana",
    lastName: "Vázquez",
    bio: "Loves photography",
    birthDate: "1990-03-14",
    isDeceased: false,
  },
  {
    id: "2",
    familyId: "demo",
    firstName: "Roberto",
    lastName: "Vázquez",
    bio: "Family patriarch",
    birthDate: "1935-06-02",
    deathDate: "2019-11-08",
    isDeceased: true,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
      <h1 className="font-[family-name:var(--font-pixel-square)] text-3xl tracking-tight">
        family.avz.mx
      </h1>
      <SignInButtons />
      <div className="flex flex-wrap justify-center gap-6">
        {samplePeople.map((person) => (
          <ProfileCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
}
