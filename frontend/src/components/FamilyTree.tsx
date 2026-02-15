import React, { useMemo } from "react";
import Tree from "react-d3-tree";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
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

interface FamilyTreeProps {
  members: Member[];
  relationships: Relationship[];
}

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export default function FamilyTree({
  members,
  relationships,
}: FamilyTreeProps) {
  /**
   * Create quick lookup map
   */
  const membersMap = useMemo(() => {
    const map = new Map<number, Member>();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  /**
   * Build Tree Data
   */
  const treeData = useMemo(() => {
    if (!members.length) return [];

    /**
     * Find children (those who appear as child in father/mother relation)
     */
    const childIds = new Set(
      relationships
        .filter(
          (r) =>
            r.relationship_type === "father" ||
            r.relationship_type === "mother"
        )
        .map((r) => r.member_id)
    );

    /**
     * Roots = members who are NOT children
     */
    const rootMembers = members.filter((m) => !childIds.has(m.id));

    /**
     * Recursive builder
     */
    const buildNode = (
      memberId: number,
      visited = new Set<number>()
    ): TreeNode => {
      if (visited.has(memberId)) {
        return { name: "..." }; // Prevent infinite loops
      }

      visited.add(memberId);

      const member = membersMap.get(memberId);
      if (!member) return { name: "Unknown" };

      const fullName = `${member.first_name} ${member.last_name}`;

      /**
       * Get spouse(s) - bidirectional safe
       */
      const spouses = relationships
        .filter(
          (r) =>
            r.relationship_type === "spouse" &&
            (r.member_id === memberId ||
              r.related_member_id === memberId)
        )
        .map((r) =>
          r.member_id === memberId
            ? membersMap.get(r.related_member_id)
            : membersMap.get(r.member_id)
        )
        .filter(Boolean) as Member[];

      /**
       * Get children
       */
      const childrenRelations = relationships.filter(
        (r) =>
          (r.relationship_type === "father" ||
            r.relationship_type === "mother") &&
          r.related_member_id === memberId
      );

      const childrenNodes = childrenRelations
        .map((r) =>
          buildNode(r.member_id, new Set(visited))
        );

      /**
       * If spouse exists, create marriage node
       */
      if (spouses.length) {
        return {
          name: fullName,
          children: [
            {
              name: `Spouse: ${spouses
                .map((s) => `${s.first_name} ${s.last_name}`)
                .join(", ")}`,
              children: childrenNodes.length
                ? childrenNodes
                : undefined,
            },
          ],
        };
      }

      /**
       * Otherwise normal node
       */
      return {
        name: fullName,
        children: childrenNodes.length
          ? childrenNodes
          : undefined,
      };
    };

    /**
     * Build all roots
     */
    const roots = rootMembers.map((m) =>
      buildNode(m.id)
    );

    /**
     * If multiple roots, wrap them
     */
    if (roots.length === 1) return roots[0];

    return {
      name: "Family",
      children: roots,
    };
  }, [members, relationships, membersMap]);

  return (
  <div style={{ width: "100%", height: "600px" }}>
    {!members.length ? (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#6b7280",
        }}
      >
        No family members found
      </div>
    ) : (
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: 400, y: 80 }}
        separation={{ siblings: 1, nonSiblings: 2 }}
      />
    )}
  </div>
);
}