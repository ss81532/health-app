// import type { Node, Edge } from "reactflow";

// /* -------------------- Types -------------------- */

// export type FamilyMember = {
//   id: number;
//   first_name: string;
//   last_name: string;
// };

// export type FamilyRelationship = {
//   member_id: number;
//   related_member_id: number;
//   relationship_type:
//     | "father"
//     | "mother"
//     | "son"
//     | "daughter"
//     | "spouse"
//     | "sibling"
//     | "grandparent"
//     | "grandchild";
// };

// type FamilyNodeData = {
//   label: string;
// };

// /* -------------------- Builder -------------------- */

// export function buildFamilyTree(
//   members: FamilyMember[],
//   relationships: FamilyRelationship[]
// ): {
//   nodes: Node<FamilyNodeData>[];
//   edges: Edge[];
// } {
//   // --- Nodes ---
//   const nodes: Node<FamilyNodeData>[] = members.map((member, index) => ({
//     id: String(member.id),
//     type: "familyNode",
//     position: { x: index * 220, y: 0 }, // simple horizontal layout
//     data: { label: `${member.first_name} ${member.last_name}` },
//   }));

//   // --- Edges ---
//   const edges: Edge[] = [];

//   relationships.forEach((rel) => {
//     const from = String(rel.member_id);
//     const to = String(rel.related_member_id);

//     // Parent → child relationships
//     if (
//       ["father", "mother", "son", "daughter", "grandparent", "grandchild"].includes(
//         rel.relationship_type
//       )
//     ) {
//       edges.push({
//         id: `${from}-${to}-${rel.relationship_type}`,
//         source: from,
//         target: to,
//         type: "smoothstep",
//         style: { stroke: "#28a745", strokeWidth: 2 }, // green for parent/child
//       });
//     }

//     // Spouse relationship (no handles)
//     if (rel.relationship_type === "spouse") {
//       edges.push({
//         id: `${from}-${to}-spouse`,
//         source: from,
//         target: to,
//         type: "smoothstep",
//         style: { stroke: "#0d6efd", strokeWidth: 2 }, // blue for spouse
//       });
//     }

//     // Sibling relationships (optional styling)
//     if (rel.relationship_type === "sibling") {
//       edges.push({
//         id: `${from}-${to}-sibling`,
//         source: from,
//         target: to,
//         type: "smoothstep",
//         style: { stroke: "#ffc107", strokeWidth: 1.5 }, // yellow for siblings
//         animated: true,
//       });
//     }
//   });

//   return { nodes, edges };
// }
