import { createClient } from "@/lib/supabase/server";
import { getFamilyPeople, getPersonByUserId } from "@/lib/people";
import { getFamilyRelationships } from "@/lib/relationships";
import { buildFamilyTree } from "@/lib/tree";
import { OWNER_USER_ID } from "@/lib/family";
import { CreateSelfForm } from "@/components/Profile/CreateSelfForm";
import { TreeDashboard } from "@/components/Tree/TreeDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guaranteed by the layout's redirect, but keeps this component self-contained.
  if (!user) return null;

  const selfPerson = await getPersonByUserId(user.id);

  if (!selfPerson) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <CreateSelfForm />
      </div>
    );
  }

  const people = await getFamilyPeople();
  const relationships = await getFamilyRelationships(people.map((p) => p.id));
  const tree = buildFamilyTree(people, relationships, selfPerson.id);

  if (!tree) {
    // Shouldn't happen once selfPerson exists, but keeps rendering safe.
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Couldn&apos;t build the tree yet.</p>
      </div>
    );
  }

  return (
    <TreeDashboard
      tree={tree}
      people={people}
      selfPerson={selfPerson}
      isOwner={user.id === OWNER_USER_ID}
    />
  );
}
