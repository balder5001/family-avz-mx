"use client";

import { useState } from "react";
import Link from "next/link";
import { TreeViewer } from "@/components/Tree/TreeViewer";
import { ProfileCard } from "@/components/Profile/ProfileCard";
import { AddRelativeForm } from "@/components/Profile/AddRelativeForm";
import { ShareProfileButton } from "@/components/Profile/ShareProfileButton";
import { Button } from "@/components/ui/button";
import type { FamilyTreeNode } from "@/lib/tree";
import type { Person } from "@/types/person";

export function TreeDashboard({
  tree,
  people,
  selfPerson,
}: {
  tree: FamilyTreeNode;
  people: Person[];
  selfPerson: Person;
}) {
  const [selectedPerson, setSelectedPerson] = useState<Person>(selfPerson);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6 lg:flex-row">
      <div className="flex-1 rounded-xl border border-border">
        <TreeViewer tree={tree} people={people} onSelectPerson={setSelectedPerson} />
      </div>

      <div className="flex w-full flex-col gap-4 lg:w-80">
        <ProfileCard person={selectedPerson} />

        {!selectedPerson.userId && <ShareProfileButton personId={selectedPerson.id} />}

        <Link
          href={`/dashboard/person/${selectedPerson.id}`}
          className="text-center text-sm text-muted-foreground hover:underline"
        >
          View full profile
        </Link>

        <Button variant="outline" className="rounded-full" onClick={() => setShowAddForm((v) => !v)}>
          {showAddForm ? "Cancel" : "Add family member"}
        </Button>

        {showAddForm && <AddRelativeForm people={people} />}
      </div>
    </div>
  );
}
