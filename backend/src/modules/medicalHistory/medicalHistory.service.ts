import { db } from "../../db/mysql";

export async function fetchMedicalHistory(memberId: number) {

  const [rows] = await db.execute(
    `
    SELECT 
      id,
      record_type,
      description,
      recorded_at,
      created_at
    FROM medical_records
    WHERE member_id = ?
    ORDER BY recorded_at DESC
    `,
    [memberId]
  );

  return rows;
}

export async function addMedicalHistory(data: {
  member_id: number;
  record_type: string;
  description: string;
  recorded_at?: string;
}) {

  const [result] = await db.execute(
    `
    INSERT INTO medical_records
    (member_id, record_type, description, recorded_at)
    VALUES (?, ?, ?, ?)
    `,
    [
      data.member_id,
      data.record_type,
      data.description,
      data.recorded_at || null
    ]
  );

  return result;
}

export async function removeMedicalHistory(historyId: number) {

  const [result] = await db.execute(
    `
    DELETE FROM medical_records
    WHERE id = ?
    `,
    [historyId]
  );

  return result;
}