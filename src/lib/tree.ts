import type { Person } from "@/types/person";
import type { Relationship } from "@/types/relationship";

export interface FamilyTreeNode {
  person: Person;
  spouse: Person | null;
  children: FamilyTreeNode[];
}

/**
 * Relationship rows are stored in both directions, so a single person_id
 * lookup is enough: type 'parent' means related_to_id is person_id's
 * parent; type 'child' means related_to_id is person_id's child.
 */
function buildEdgeMaps(relationships: Relationship[]) {
  const parentOf = new Map<string, string[]>(); // personId -> parent ids
  const childrenOf = new Map<string, string[]>(); // personId -> child ids
  const spouseOf = new Map<string, string>(); // personId -> spouse id

  for (const rel of relationships) {
    if (rel.relationshipType === "parent") {
      const list = parentOf.get(rel.personId) ?? [];
      list.push(rel.relatedToId);
      parentOf.set(rel.personId, list);
    } else if (rel.relationshipType === "child") {
      const list = childrenOf.get(rel.personId) ?? [];
      list.push(rel.relatedToId);
      childrenOf.set(rel.personId, list);
    } else if (rel.relationshipType === "spouse") {
      spouseOf.set(rel.personId, rel.relatedToId);
    }
  }

  return { parentOf, childrenOf, spouseOf };
}

/** Walks up the parent chain from `startId` to find the topmost known ancestor. */
function findRootAncestorId(
  startId: string,
  parentOf: Map<string, string[]>,
  visited = new Set<string>(),
): string {
  if (visited.has(startId)) return startId; // guard against cycles
  visited.add(startId);

  const parents = parentOf.get(startId);
  if (!parents || parents.length === 0) return startId;
  return findRootAncestorId(parents[0], parentOf, visited);
}

function buildSubtree(
  personId: string,
  peopleById: Map<string, Person>,
  childrenOf: Map<string, string[]>,
  spouseOf: Map<string, string>,
  visited: Set<string>,
): FamilyTreeNode | null {
  const person = peopleById.get(personId);
  if (!person || visited.has(personId)) return null;
  visited.add(personId);

  const spouseId = spouseOf.get(personId);
  const spouse = spouseId ? (peopleById.get(spouseId) ?? null) : null;

  const childIds = childrenOf.get(personId) ?? [];
  const children = childIds
    .map((childId) => buildSubtree(childId, peopleById, childrenOf, spouseOf, visited))
    .filter((node): node is FamilyTreeNode => node !== null);

  return { person, spouse, children };
}

/**
 * Builds a descendant tree rooted at the topmost known ancestor of
 * `centerPersonId`. Spouses ride along on their partner's node rather than
 * getting their own branch — a simplification for the first version.
 */
export function buildFamilyTree(
  people: Person[],
  relationships: Relationship[],
  centerPersonId: string,
): FamilyTreeNode | null {
  const peopleById = new Map(people.map((p) => [p.id, p]));
  const { parentOf, childrenOf, spouseOf } = buildEdgeMaps(relationships);

  const rootId = findRootAncestorId(centerPersonId, parentOf);
  return buildSubtree(rootId, peopleById, childrenOf, spouseOf, new Set());
}
