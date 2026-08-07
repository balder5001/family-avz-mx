"use client";

import { useState } from "react";
import { addRelative } from "@/lib/actions";
import { fullName } from "@/types/person";
import type { Person } from "@/types/person";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddRelativeForm({ people }: { people: Person[] }) {
  const [isDeceased, setIsDeceased] = useState(false);

  return (
    <form action={addRelative} className="flex w-full max-w-sm flex-col gap-4">
      <h2 className="text-lg font-semibold">Add a family member</h2>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="relFirstName">First name</Label>
        <Input id="relFirstName" name="firstName" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="relLastName">Last name</Label>
        <Input id="relLastName" name="lastName" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="relBirthDate">Birth date</Label>
        <Input id="relBirthDate" name="birthDate" type="date" />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isDeceased"
          name="isDeceased"
          value="on"
          checked={isDeceased}
          onCheckedChange={(checked) => setIsDeceased(checked === true)}
        />
        <Label htmlFor="isDeceased">Deceased</Label>
      </div>
      {isDeceased && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deathDate">Death date</Label>
          <Input id="deathDate" name="deathDate" type="date" />
        </div>
      )}

      <div className="flex gap-2">
        <Select name="relationshipType" required defaultValue="child">
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="child">is the child of</SelectItem>
            <SelectItem value="parent">is the parent of</SelectItem>
            <SelectItem value="sibling">is the sibling of</SelectItem>
            <SelectItem value="spouse">is the spouse of</SelectItem>
          </SelectContent>
        </Select>
        <Select name="relativeToId" required defaultValue={people[0]?.id}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {people.map((person) => (
              <SelectItem key={person.id} value={person.id}>
                {fullName(person)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="rounded-full">
        Add to tree
      </Button>
    </form>
  );
}
