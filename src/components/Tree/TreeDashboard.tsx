"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ProfileCard } from "@/components/Profile/ProfileCard";
import { AddRelativeForm } from "@/components/Profile/AddRelativeForm";
import { ShareProfileButton } from "@/components/Profile/ShareProfileButton";
import { RemoveButton } from "@/components/Profile/RemoveButton";
import { Button } from "@/components/ui/button";
import type { FamilyTreeNode } from "@/lib/tree";
import type { Person } from "@/types/person";
import { fullName } from "@/types/person";

// react-d3-tree assigns each node a random id on every render, which mismatches
// between the server-rendered markup and the client's first render. It also
// measures node dimensions via the DOM, so it can't be server-rendered
// meaningfully anyway — skip SSR for it entirely.
const TreeViewer = dynamic(
  () => import("@/components/Tree/TreeViewer").then((mod) => mod.TreeViewer),
  { ssr: false, loading: () => <div className="h-[600px] w-full" /> },
);

export function TreeDashboard({
  tree,
  people,
  selfPerson,
  isOwner,
}: {
  tree: FamilyTreeNode;
  people: Person[];
  selfPerson: Person;
  isOwner: boolean;
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

        {!selectedPerson.userId && isOwner && (
          <RemoveButton personId={selectedPerson.id} personName={fullName(selectedPerson)} />
        )}

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
