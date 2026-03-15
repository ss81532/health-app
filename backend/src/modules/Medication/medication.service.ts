
import { OkPacket, RowDataPacket } from "mysql2/promise";
import { db } from "../../db/mysql";

export interface MedicationData {
  medicine_name: string;
  dosage?: string;
  frequency: "once" | "twice" | "thrice";
  timing: string[]; // ["morning","night"]
  start_date: string;
  end_date?: string;
  instructions?: string;
  is_active?: boolean;
}

export async function createMedication(memberId: number, data: MedicationData) {
  const [result] = await db.execute<OkPacket>(
    `INSERT INTO medications 
      (member_id, medicine_name, dosage, frequency, timing, start_date, end_date, instructions,medical_record_id, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      memberId,
      data.medicine_name,
      data.dosage ?? null,
      data.frequency,
      JSON.stringify(data.timing),
      data.start_date,
      data.end_date ?? null,
      data.instructions ?? null,
      data.is_active ?? true,
    ]
  );

  return { id: result.insertId, member_id: memberId, ...data };
}

export async function getMedications(memberId: number) {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM medications WHERE member_id = ?`,
    [memberId]
  );
  return rows;
}

export async function getActiveMedications(memberId: number) {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM medications WHERE member_id = ? AND is_active = 1`,
    [memberId]
  );
  return rows;
}

export async function updateMedication(id: number, data: Partial<MedicationData>) {
  const fields = [];
  const values: any[] = [];

  for (const key in data) {
    if (key === "timing") {
      fields.push(`${key} = ?`);
      values.push(JSON.stringify(data[key as keyof MedicationData]));
    } else {
      fields.push(`${key} = ?`);
      values.push(data[key as keyof MedicationData]);
    }
  }
  values.push(id);

  await db.execute(
    `UPDATE medications SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM medications WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function deleteMedication(id: number) {
  await db.execute(`DELETE FROM medications WHERE id = ?`, [id]);
}
