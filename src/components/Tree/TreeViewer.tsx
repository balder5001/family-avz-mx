"use client";

import { useCallback, useMemo } from "react";
import Tree from "react-d3-tree";
import type { CustomNodeElementProps, RawNodeDatum } from "react-d3-tree";
import type { FamilyTreeNode } from "@/lib/tree";
import type { Person } from "@/types/person";
import { fullName } from "@/types/person";

function toRawNode(node: FamilyTreeNode): RawNodeDatum {
  return {
    name: fullName(node.person),
    attributes: {
      personId: node.person.id,
      isDeceased: node.person.isDeceased,
      birthDate: node.person.birthDate ?? "",
      deathDate: node.person.deathDate ?? "",
      ...(node.spouse ? { spouseName: fullName(node.spouse) } : {}),
    },
    children: node.children.map(toRawNode),
  };
}

function yearOf(isoDate: string) {
  return isoDate ? isoDate.slice(0, 4) : "";
}

export function TreeViewer({
  tree,
  people,
  onSelectPerson,
}: {
  tree: FamilyTreeNode;
  people: Person[];
  onSelectPerson: (person: Person) => void;
}) {
  const peopleById = useMemo(() => new Map(people.map((p) => [p.id, p])), [people]);
  const data = useMemo(() => toRawNode(tree), [tree]);

  const renderNode = useCallback(
    ({ nodeDatum }: CustomNodeElementProps) => {
      const attrs = nodeDatum.attributes ?? {};
      const personId = attrs.personId as string;
      const isDeceased = Boolean(attrs.isDeceased);
      const spouseName = attrs.spouseName as string | undefined;
      const birthYear = yearOf(attrs.birthDate as string);
      const deathYear = yearOf(attrs.deathDate as string);
      const person = peopleById.get(personId);

      return (
        <g
          onClick={() => person && onSelectPerson(person)}
          style={{ cursor: person ? "pointer" : "default" }}
        >
          <circle
            r={20}
            fill="#a3a3a3"
            stroke={isDeceased ? "#f59e0b" : "#737373"}
            strokeWidth={isDeceased ? 3 : 1.5}
            opacity={isDeceased ? 0.8 : 1}
          />
          {/* Matches the --foreground variable body text already relies on
              (globals.css), rather than a Tailwind dark: class — SVG fill
              didn't pick up the dark: variant reliably. */}
          <text x={28} y={0} style={{ fill: "var(--foreground)" }} className="text-[14px] font-medium">
            {nodeDatum.name}
            {spouseName ? ` & ${spouseName}` : ""}
          </text>
          {(birthYear || deathYear) && (
            <text x={28} y={18} fill="#a3a3a3" className="text-[11px]">
              {birthYear}
              {isDeceased ? ` – ${deathYear}` : ""}
            </text>
          )}
        </g>
      );
    },
    [peopleById, onSelectPerson],
  );

  return (
    <div className="h-[600px] w-full">
      <Tree
        data={data}
        renderCustomNodeElement={renderNode}
        orientation="vertical"
        pathFunc="step"
        translate={{ x: 300, y: 60 }}
        separation={{ siblings: 1.5, nonSiblings: 2 }}
        zoomable
        collapsible={false}
      />
    </div>
  );
}
