"use client";

import { useCallback, useMemo } from "react";
import Tree from "react-d3-tree";
import type { CustomNodeElementProps, RawNodeDatum } from "react-d3-tree";
import type { FamilyTreeNode } from "@/lib/tree";
import type { Person } from "@/types/person";
import { fullName } from "@/types/person";

const DEFAULT_NODE_COLOR = "#3B82F6";
const DECEASED_GOLD = "#f59e0b";
const LABEL_BG = "#171717"; // fixed dark chip behind every label, regardless of theme
const LABEL_TEXT = "#f5f5f5"; // fixed light text on that chip — always readable

function toRawNode(node: FamilyTreeNode): RawNodeDatum {
  return {
    name: fullName(node.person),
    attributes: {
      personId: node.person.id,
      isDeceased: node.person.isDeceased,
      birthDate: node.person.birthDate ?? "",
      deathDate: node.person.deathDate ?? "",
      nodeColor: node.person.nodeColor ?? DEFAULT_NODE_COLOR,
      ...(node.spouse ? { spouseName: fullName(node.spouse) } : {}),
    },
    children: node.children.map(toRawNode),
  };
}

function yearOf(isoDate: string) {
  return isoDate ? isoDate.slice(0, 4) : "";
}

// Rough width estimate for a solid label background — SVG can't auto-size a
// <rect> to sibling text, so this approximates it from character count.
function estimateLabelWidth(text: string) {
  return Math.max(40, text.length * 7 + 16);
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
      const nodeColor = (attrs.nodeColor as string) || DEFAULT_NODE_COLOR;
      const birthYear = yearOf(attrs.birthDate as string);
      const deathYear = yearOf(attrs.deathDate as string);
      const person = peopleById.get(personId);

      const label = `${nodeDatum.name}${spouseName ? ` & ${spouseName}` : ""}`;
      const subLabel = birthYear || deathYear ? `${birthYear}${isDeceased ? ` – ${deathYear}` : ""}` : "";
      const chipWidth = Math.max(estimateLabelWidth(label), subLabel ? estimateLabelWidth(subLabel) : 0);

      return (
        <g
          onClick={() => person && onSelectPerson(person)}
          style={{ cursor: person ? "pointer" : "default" }}
        >
          <circle
            r={20}
            fill={nodeColor}
            stroke={isDeceased ? DECEASED_GOLD : "#ffffff"}
            strokeWidth={isDeceased ? 3 : 1.5}
            strokeOpacity={isDeceased ? 1 : 0.4}
            opacity={isDeceased ? 0.85 : 1}
          />

          {/* Fixed-color chip behind the label so it's readable regardless
              of the page's light/dark theme or what's behind the tree. */}
          <rect
            x={28}
            y={subLabel ? -12 : -10}
            width={chipWidth}
            height={subLabel ? 34 : 20}
            rx={6}
            fill={LABEL_BG}
          />
          <text x={28 + 8} y={subLabel ? 2 : 4} fill={LABEL_TEXT} className="text-[13px] font-medium">
            {label}
          </text>
          {subLabel && (
            <text x={28 + 8} y={18} fill={LABEL_TEXT} fillOpacity={0.7} className="text-[11px]">
              {subLabel}
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
        separation={{ siblings: 1.8, nonSiblings: 2.2 }}
        zoomable
        collapsible={false}
      />
    </div>
  );
}
