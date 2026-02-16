import { pool } from "../../db";

export interface CreateFamilyInput {
  name: string;
  description?: string;
}

export async function createFamily(data: CreateFamilyInput) {
  const [result] = await pool.query(
    `
    INSERT INTO families (name, description)
    VALUES (?, ?)
    `,
    [data.name, data.description || null]
  );

  const insertResult = result as any;

  return {
    id: insertResult.insertId,
    ...data,
  };
}

export async function getFamilyById(id: number) {
  const [rows] = await pool.query(
    `
    SELECT id, name, description, created_at
    FROM families
    WHERE id = ?
    `,
    [id]
  );

  const families = rows as any[];

  return families[0] || null;
}

export async function getAllFamilies() {
  const [rows] = await pool.query(`
    SELECT 
      f.id,
      f.name,
      COUNT(m.id) AS members_count
    FROM families f
    LEFT JOIN family_members m ON m.family_id = f.id
    GROUP BY f.id
    ORDER BY f.created_at DESC
  `);

  return rows;
}

export async  function getActiveFamilyMedications(id: number) {
  const [rows] = await pool.execute(
    `
    SELECT 
      m.id,
      m.medicine_name,
      m.dosage,
      m.frequency,
      m.timing,
      m.start_date,
      m.end_date,
      fm.id AS member_id,
      fm.first_name,
      fm.last_name
    FROM medications m
    JOIN family_members fm 
      ON m.member_id = fm.id
    WHERE fm.family_id = ?
      AND m.is_active = 1
      AND (m.end_date IS NULL OR m.end_date >= CURDATE())
    ORDER BY fm.first_name, m.start_date DESC
    `,
    [id]
  );

  return rows;
}