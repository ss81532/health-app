import React, { useMemo } from "react";
import Tree from "react-d3-tree";



interface Member {
  id: number;
  first_name: string;
  last_name: string;
}

interface FamilyTreeProps {
  members: Member[];
  relationships: Relationship[];
}

interface TreeNode {
  name: string;
  attributes?: Record<string, any>;
  children?: TreeNode[];
}

export type RelationshipType =
  | "father"
  | "mother"
  | "son"
  | "daughter"
  | "spouse"
  | "sibling"
  | "grandparent"
  | "grandchild";

export interface Relationship {
  member_id: number;
  related_member_id: number;
  relationship_type: RelationshipType;
}


export default function FamilyTree({ members, relationships }: FamilyTreeProps) {
  // Map members by id for easy lookup

  const membersMap = useMemo(() => {
    const map = new Map<number, Member>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  // Convert relationships into a tree
  const treeData = useMemo(() => {
    const roots: TreeNode[] = [];

    // Find root nodes (members without fathers/mothers)
    const childIds = new Set(
      relationships
        .filter((r) => r.relationship_type === "son" || r.relationship_type === "daughter")
        .map((r) => r.member_id)
    );

    const rootMembers = members.filter((m) => !childIds.has(m.id));

    // Recursive function to build node
    const buildNode = (memberId: number): TreeNode => {
      const member = membersMap.get(memberId)!;
      const node: TreeNode = {
        name: `${member.first_name} ${member.last_name}`,
        attributes: {},
        children: [],
      };

      // Add spouse(s) if any
      const spouses = relationships
        .filter(
          (r) =>
            r.relationship_type === "spouse" &&
            r.member_id === memberId &&
            membersMap.has(r.related_member_id)
        )
        .map((r) => membersMap.get(r.related_member_id)!);

      if (spouses.length) {
        node.name += " ❤️ " + spouses.map((s) => s.first_name).join(", ");
      }

      // Add children
      const children = relationships
        .filter(
          (r) =>
            (r.relationship_type === "father" || r.relationship_type === "mother") &&
            r.related_member_id === memberId &&
            membersMap.has(r.member_id)
        )
        .map((r) => buildNode(r.member_id));

      if (children.length) {
        node.children = children;
      }

      if (!node.children?.length) delete node.children;

      return node;
    };

    rootMembers.forEach((m) => roots.push(buildNode(m.id)));

    return roots.length === 1 ? roots[0] : { name: "Family", children: roots };
  }, [membersMap, relationships]);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Tree data={treeData} orientation="vertical" translate={{ x: 300, y: 50 }} />
    </div>
  );
}
