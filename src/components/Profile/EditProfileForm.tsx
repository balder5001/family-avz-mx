"use client";

import { updateOwnProfile } from "@/lib/actions";
import type { Person } from "@/types/person";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function EditProfileForm({ person }: { person: Person }) {
  return (
    <form action={updateOwnProfile} className="flex w-full max-w-sm flex-col gap-4">
      <h2 className="text-lg font-semibold">Edit your info</h2>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Short bio</Label>
        <Textarea id="bio" name="bio" rows={3} defaultValue={person.bio ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="education">Education</Label>
        <Input id="education" name="education" defaultValue={person.education ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phoneNumber">Phone number</Label>
        <Input id="phoneNumber" name="phoneNumber" defaultValue={person.phoneNumber ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="instagramUrl">Instagram URL</Label>
        <Input id="instagramUrl" name="instagramUrl" defaultValue={person.instagramUrl ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="facebookUrl">Facebook URL</Label>
        <Input id="facebookUrl" name="facebookUrl" defaultValue={person.facebookUrl ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="googleUrl">Google/website URL</Label>
        <Input id="googleUrl" name="googleUrl" defaultValue={person.googleUrl ?? ""} />
      </div>

      <Button type="submit" className="rounded-full">
        Save
      </Button>
    </form>
  );
}
