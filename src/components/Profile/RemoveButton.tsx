"use client";

import { useTransition } from "react";
import { deletePerson } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function RemoveButton({ personId, personName }: { personId: string; personName: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Remove ${personName} from the tree? This can't be undone.`)) return;
    startTransition(() => deletePerson(personId));
  }

  return (
    <Button variant="destructive" className="rounded-full" onClick={handleClick} disabled={isPending}>
      {isPending ? "Removing…" : "Remove from tree"}
    </Button>
  );
}
