import { createClient } from "@/lib/supabase/server";
import { FAMILY_ID } from "@/lib/family";
import type { Person } from "@/types/person";

interface PersonRow {
  id: string;
  family_id: string;
  user_id: string | null;
  first_name: string;
  last_name: string | null;
  bio: string | null;
  education: string | null;
  birth_date: string | null;
  death_date: string | null;
  is_deceased: boolean;
  phone_number: string | null;
  profile_photo_url: string | null;
  node_color: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  google_url: string | null;
}

function rowToPerson(row: PersonRow): Person {
  return {
    id: row.id,
    familyId: row.family_id,
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    bio: row.bio,
    education: row.education,
    birthDate: row.birth_date,
    deathDate: row.death_date,
    isDeceased: row.is_deceased,
    phoneNumber: row.phone_number,
    profilePhotoUrl: row.profile_photo_url,
    nodeColor: row.node_color,
    instagramUrl: row.instagram_url,
    facebookUrl: row.facebook_url,
    googleUrl: row.google_url,
  };
}

export async function getFamilyPeople(): Promise<Person[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("family_id", FAMILY_ID);

  if (error) throw error;
  return (data as PersonRow[]).map(rowToPerson);
}

export async function getPersonByUserId(userId: string): Promise<Person | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToPerson(data as PersonRow) : null;
}

export async function getPersonById(id: string): Promise<Person | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("people").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data ? rowToPerson(data as PersonRow) : null;
}
