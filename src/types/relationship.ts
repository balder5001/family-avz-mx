export type RelationshipType = "parent" | "child" | "sibling" | "spouse";

export interface Relationship {
  id: string;
  personId: string;
  relatedToId: string;
  relationshipType: RelationshipType;
}
