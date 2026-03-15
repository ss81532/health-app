import axios from "axios";
import { API_BASE_URL } from "../config/api";

export interface MedicalRecord {
  id: number;
  member_id: number;
  record_type: "diagnosis" | "condition" | "allergy" | "vital" | "note";
  description: string;
  recorded_at: string | null;
  created_at: string;
}

/**
 * Get medical history for a member
 */
export async function getMedicalRecords(memberId: number): Promise<MedicalRecord[]> {
  const res = await axios.get(`${API_BASE_URL}/medical-records/members/${memberId}/history`);
  return res.data;
}

/**
 * Create medical record
 */
export async function createMedicalRecord(
  memberId: number,
  payload: {
    record_type: string;
    description: string;
    recorded_at?: string;
  }
) {
  const res = await axios.post(`${API_BASE_URL}/medical-records/members/${memberId}/history`, payload);
  return res.data;
}

/**
 * Delete medical record
 */
export async function deleteMedicalRecord(memberId: number, historyId: number) {
  const res = await axios.delete(`${API_BASE_URL}/medical-records/members/${memberId}/history/${historyId}`);
  return res.data;
}