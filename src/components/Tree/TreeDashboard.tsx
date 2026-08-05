"use client";

import { useState } from "react";
import { TreeViewer } from "@/components/Tree/TreeViewer";
import { ProfileCard } from "@/components/Profile/ProfileCard";
import { AddRelativeForm } from "@/components/Profile/AddRelativeForm";
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
      <div className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <TreeViewer tree={tree} people={people} onSelectPerson={setSelectedPerson} />
      </div>

      <div className="flex w-full flex-col gap-4 lg:w-80">
        <ProfileCard person={selectedPerson} />

        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          {showAddForm ? "Cancel" : "Add family member"}
        </button>

        {showAddForm && <AddRelativeForm people={people} />}
      </div>
    </div>
  );
}
