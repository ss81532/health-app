import { pool } from "../../db";

export interface CreateRelationshipInput {
  family_id: number;
  member_id: number;
  related_member_id: number;
  relationship_type:
    | "father"
    | "mother"
    | "son"
    | "daughter"
    | "spouse"
    | "sibling"
    | "grandparent"
    | "grandchild";
}

function getReverseType(
  type: CreateRelationshipInput["relationship_type"]
): CreateRelationshipInput["relationship_type"] {
  switch (type) {
    case "father":
      return "son"; // default assumption (better handled later)
    case "mother":
      return "son";
    case "son":
      return "father";
    case "daughter":
      return "father";
    case "spouse":
      return "spouse";
    case "sibling":
      return "sibling";
    case "grandparent":
      return "grandchild";
    case "grandchild":
      return "grandparent";
    default:
      throw new Error("Invalid relationship type");
  }
}


export async function createRelationship(data: CreateRelationshipInput) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO family_relationships
       (family_id, member_id, related_member_id, relationship_type)
       VALUES (?, ?, ?, ?)`,
      [
        data.family_id,
        data.member_id,
        data.related_member_id,
        data.relationship_type,
      ]
    );

    const reverseType = getReverseType(data.relationship_type);

    await conn.query(
      `INSERT INTO family_relationships
       (family_id, member_id, related_member_id, relationship_type)
       VALUES (?, ?, ?, ?)`,
      [
        data.family_id,
        data.related_member_id,
        data.member_id,
        reverseType,
      ]
    );

    await conn.commit();
    return { ...data, reverseType };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}


export async function getRelationshipsByMember(member_id: number) {
  const [rows] = await pool.query(
    `SELECT id, family_id, member_id, related_member_id, relationship_type, created_at
     FROM family_relationships
     WHERE member_id = ?`,
    [member_id]
  );
  return rows as any[];
}

export async function getRelationshipsByFamily(family_id: number) {
  const [rows] = await pool.query(
    `SELECT id, family_id, member_id, related_member_id, relationship_type, created_at
     FROM family_relationships
     WHERE family_id = ?`,
    [family_id]
  );
  return rows as any[];
}
