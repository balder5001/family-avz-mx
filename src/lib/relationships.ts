import { createClient } from "@/lib/supabase/server";
import type { Relationship, RelationshipType } from "@/types/relationship";

interface RelationshipRow {
  id: string;
  person_id: string;
  related_to_id: string;
  relationship_type: RelationshipType;
}

function rowToRelationship(row: RelationshipRow): Relationship {
  return {
    id: row.id,
    personId: row.person_id,
    relatedToId: row.related_to_id,
    relationshipType: row.relationship_type,
  };
}

export async function getFamilyRelationships(personIds: string[]): Promise<Relationship[]> {
  if (personIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("relationships")
    .select("*")
    .in("person_id", personIds);

  if (error) throw error;
  return (data as RelationshipRow[]).map(rowToRelationship);
}
