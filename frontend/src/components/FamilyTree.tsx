import React from "react";

export type FamilyMember = {
  id: number;
  first_name: string;
  last_name: string;
  gender: "male" | "female" | "other";
};

export type FamilyRelationship = {
  id: number;
  member_id: number;
  related_member_id: number;
  relationship: "parent" | "child" | "spouse";
};

type Props = {
  members: FamilyMember[];
  relationships: FamilyRelationship[];
};

/**
 * Simple Family Tree (Vertical)
 * Parents → Member → Children
 */
export default function FamilyTree({ members, relationships }: Props) {
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  function getParents(memberId: number) {
    return relationships
      .filter((r) => r.related_member_id === memberId && r.relationship === "parent")
      .map((r) => memberMap[r.member_id])
      .filter(Boolean);
  }

  function getChildren(memberId: number) {
    return relationships
      .filter((r) => r.member_id === memberId && r.relationship === "parent")
      .map((r) => memberMap[r.related_member_id])
      .filter(Boolean);
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Family Tree</h2>

      <div className="space-y-8">
        {members.map((member) => (
          <div key={member.id} className="border rounded-2xl p-4 shadow-sm">
            {/* Parents */}
            <div className="flex justify-center gap-4 mb-2">
              {getParents(member.id).map((p) => (
                <Node key={p.id} member={p} small />
              ))}
            </div>

            {/* Member */}
            <div className="flex justify-center">
              <Node member={member} />
            </div>

            {/* Children */}
            <div className="flex justify-center gap-4 mt-2">
              {getChildren(member.id).map((c) => (
                <Node key={c.id} member={c} small />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Node({ member, small }: { member: FamilyMember; small?: boolean }) {
  return (
    <div
      className={`text-center rounded-xl border px-4 py-2 shadow ${
        small ? "text-sm" : "font-medium"
      }`}
    >
      <div>{member.first_name} {member.last_name}</div>
      <div className="text-xs text-muted-foreground">{member.gender}</div>
    </div>
  );
}
