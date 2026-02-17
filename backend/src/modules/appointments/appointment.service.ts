
import { db } from "../../db/mysql";
import { Appointment } from "./appointments.types";

export async function getUpcomingAppointments() {
  const [rows] = await db.execute(
    `
    SELECT a.*, m.first_name, m.last_name
    FROM appointments a
    JOIN family_members m ON a.member_id = m.id
    WHERE a.appointment_date >= NOW()
      AND a.status = 'scheduled'
    ORDER BY a.appointment_date ASC
    `
  );

  return rows;
}

export async function getAppointmentsByMember(memberId: number) {
  const [rows] = await db.execute(
    `
    SELECT *
    FROM appointments
    WHERE member_id = ?
    ORDER BY appointment_date DESC
    `,
    [memberId]
  );

  return rows;
}

export async function createAppointment(data: any) {
  const [result]: any = await db.execute(
    `
    INSERT INTO appointments
      (family_id, member_id, doctor_name, hospital_name,
       appointment_date, reason, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.familyId,          // ✅ camelCase
      data.memberId,
      data.doctorName,
      data.hospitalName,
      data.appointmentDate,
      data.reason || null,
      data.status || "scheduled",
      data.notes || null,
    ]
  );

  return result.insertId;
}

export async function updateAppointment(id: number, data: Partial<Appointment>) {
  const fields: string[] = [];
  const values: any[] = [];

  // Only add fields that are not null or undefined
  if (data.doctor_name != null) {
    fields.push("doctor_name = ?");
    values.push(data.doctor_name);
  }
  if (data.hospital_name != null) {
    fields.push("hospital_name = ?");
    values.push(data.hospital_name);
  }
  if (data.appointment_date != null) {
    fields.push("appointment_date = ?");
    values.push(data.appointment_date);
  }
  if (data.reason != null) {
    fields.push("reason = ?");
    values.push(data.reason);
  }
  if (data.notes != null) {
    fields.push("notes = ?");
    values.push(data.notes);
  }
  if (data.status != null) {
    fields.push("status = ?");
    values.push(data.status);
  }

  // Nothing to update
  if (fields.length === 0) return;

  values.push(id);

  const sql = `UPDATE appointments SET ${fields.join(", ")} WHERE id = ?`;
  await db.execute(sql, values);
}

export async function deleteAppointment(id: number) {
  await db.execute(
    `DELETE FROM appointments WHERE id = ?`,
    [id]
  );
}

export async function getUpcomingByFamily(familyId: number) {
  const [rows] = await db.execute(
    `
    SELECT a.*, m.first_name, m.last_name
    FROM appointments a
    JOIN family_members m ON a.member_id = m.id
    WHERE a.family_id = ?
      AND a.appointment_date >= NOW()
      AND a.status = 'scheduled'
    ORDER BY a.appointment_date ASC
    `,
    [familyId]
  );

  return rows;
}

export async function getAllByFamily(familyId: number) {
  const [rows] = await db.execute(
    `
    SELECT a.*, m.first_name, m.last_name
    FROM appointments a
    JOIN family_members m ON a.member_id = m.id
    WHERE a.family_id = ?
    ORDER BY a.appointment_date DESC
    `,
    [familyId]
  );

  return rows;
}