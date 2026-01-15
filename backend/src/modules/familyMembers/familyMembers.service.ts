import { pool } from "../../db";

export interface CreateMemberInput {
  family_id: number;
  first_name: string;
  last_name?: string;
  date_of_birth?: string; // YYYY-MM-DD
  gender?: "male" | "female" | "other";
  blood_group?: string;
}


export async function createMember(data: CreateMemberInput) {
  const [result] = await pool.query(
    `
    INSERT INTO family_members
    (family_id, first_name, last_name, date_of_birth, gender, blood_group)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      data.family_id,
      data.first_name,
      data.last_name ?? null,
      data.date_of_birth ?? null,
      data.gender ?? null,
      data.blood_group ?? null,
    ]
  );

  const insertResult = result as any;

  return {
    id: insertResult.insertId,
    ...data,
  };
}


export async function getMembersByFamily(familyId: number) {
  const [rows] = await pool.query(
    `
    SELECT id, family_id, first_name, last_name, date_of_birth, gender, created_at
    FROM family_members
    WHERE family_id = ?
    `,
    [familyId]
  );

  return rows as any[];
}
