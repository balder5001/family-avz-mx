"use client";

import { useCallback, useMemo } from "react";
import Tree from "react-d3-tree";
import type { CustomNodeElementProps, RawNodeDatum } from "react-d3-tree";
import type { FamilyTreeNode } from "@/lib/tree";
import type { Person } from "@/types/person";
import { fullName } from "@/types/person";

const DEFAULT_NODE_COLOR = "#3B82F6";
const DECEASED_GOLD = "#f59e0b";

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

          {/* Real HTML via foreignObject instead of SVG <text> — SVG text
              rendered blurry/low-contrast in Chrome regardless of color
              (confirmed via computed styles), likely a sub-pixel/zoom-scale
              rendering quirk. HTML text gets normal font rendering. */}
          <foreignObject x={26} y={-16} width={220} height={44} style={{ overflow: "visible" }}>
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                gap: 1,
                background: "#171717",
                color: "#f5f5f5",
                borderRadius: 6,
                padding: "4px 8px",
                fontFamily: "Arial, Helvetica, sans-serif",
                whiteSpace: "nowrap",
                width: "fit-content",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.2 }}>{label}</span>
              {subLabel && (
                <span style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.2 }}>{subLabel}</span>
              )}
            </div>
          </foreignObject>
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
