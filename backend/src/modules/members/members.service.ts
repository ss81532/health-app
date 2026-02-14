import { db } from "../../db/mysql";

export async function getMemberById(memberId: number) {
  const [rows]: any = await db.query(
    `
    SELECT *
    FROM family_members
    WHERE id = ?
    LIMIT 1
    `,
    [memberId]
  );

  return rows[0] ?? null;
}
