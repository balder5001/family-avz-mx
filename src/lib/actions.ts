"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { FAMILY_ID } from "@/lib/family";
import type { RelationshipType } from "@/types/relationship";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

export async function createSelfProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  // Guards against double form submissions creating two rows for one user;
  // the people_user_id_unique index (migration 010) is the DB-level backstop.
  const { data: existing } = await supabase
    .from("people")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) {
    revalidatePath("/dashboard");
    return;
  }

  const { error } = await supabase.from("people").insert({
    family_id: FAMILY_ID,
    user_id: user.id,
    first_name: str(formData, "firstName"),
    last_name: str(formData, "lastName"),
    bio: str(formData, "bio"),
    birth_date: str(formData, "birthDate"),
  });

  if (error) throw error;
  revalidatePath("/dashboard");
}

const INVERSE_RELATIONSHIP: Record<RelationshipType, RelationshipType> = {
  parent: "child",
  child: "parent",
  sibling: "sibling",
  spouse: "spouse",
};

export async function addRelative(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const relativeToId = str(formData, "relativeToId");
  const relationshipType = str(formData, "relationshipType") as RelationshipType | null;
  if (!relativeToId || !relationshipType) {
    throw new Error("Missing relative or relationship type");
  }

  const isDeceased = formData.get("isDeceased") === "on";

  const { data: newPerson, error: insertError } = await supabase
    .from("people")
    .insert({
      family_id: FAMILY_ID,
      first_name: str(formData, "firstName"),
      last_name: str(formData, "lastName"),
      birth_date: str(formData, "birthDate"),
      death_date: isDeceased ? str(formData, "deathDate") : null,
      is_deceased: isDeceased,
    })
    .select("id")
    .single();

  if (insertError) throw insertError;

  // New person's edge is the type the form describes ("this person is the
  // ___ of [relative]"); the existing relative gets the inverse edge back.
  const { error: relError } = await supabase.from("relationships").insert([
    {
      person_id: newPerson.id,
      related_to_id: relativeToId,
      relationship_type: relationshipType,
    },
    {
      person_id: relativeToId,
      related_to_id: newPerson.id,
      relationship_type: INVERSE_RELATIONSHIP[relationshipType],
    },
  ]);

  if (relError) throw relError;
  revalidatePath("/dashboard");
}

export async function claimPerson(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const personId = str(formData, "personId");
  if (!personId) throw new Error("Missing person");

  const { data: alreadyClaimed } = await supabase
    .from("people")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (alreadyClaimed) {
    throw new Error("You already have a profile — you can't claim another one.");
  }

  // The people_user_id_unique index (migration 010) is the DB-level backstop
  // for the same check; this also guards against claiming an already-linked person.
  const { error } = await supabase
    .from("people")
    .update({ user_id: user.id })
    .eq("id", personId)
    .is("user_id", null);

  if (error) throw error;
  revalidatePath(`/dashboard/person/${personId}`);
  revalidatePath("/dashboard");
}

export async function updateOwnProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("people")
    .update({
      bio: str(formData, "bio"),
      education: str(formData, "education"),
      phone_number: str(formData, "phoneNumber"),
      instagram_url: str(formData, "instagramUrl"),
      facebook_url: str(formData, "facebookUrl"),
      google_url: str(formData, "googleUrl"),
    })
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard");
}
