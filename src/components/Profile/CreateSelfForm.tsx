"use client";

import { createSelfProfile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function CreateSelfForm() {
  return (
    <form action={createSelfProfile} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Create your profile</h1>
        <p className="text-sm text-muted-foreground">This becomes your spot in the family tree.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="firstName">First name</Label>
        <Input id="firstName" name="firstName" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="lastName">Last name</Label>
        <Input id="lastName" name="lastName" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="birthDate">Birth date</Label>
        <Input id="birthDate" name="birthDate" type="date" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Short bio</Label>
        <Textarea id="bio" name="bio" rows={3} />
      </div>

      <Button type="submit" className="rounded-full">
        Create profile
      </Button>
    </form>
  );
}
