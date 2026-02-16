import axios from "axios";
import { API_BASE_URL } from "../config/api";

// types for Medication
export interface Medication {
  id: number;
  member_id: number;
  medicine_name: string;
  dosage?: string;
  frequency: "once" | "twice" | "thrice";
  timing: string[];
  start_date: string;
  end_date?: string | null;
  instructions?: string;
  is_active: boolean;
  created_at: string;
}

export interface MedicationCreateData {
  medicine_name: string;
  dosage?: string;
  frequency: "once" | "twice" | "thrice";
  timing: string[];
  start_date: string;
  end_date?: string | null;
  instructions?: string;
  is_active?: boolean;
}

/**
 * Fetch all medications for a family
 */
export async function fetchActiveFamilyMedications(familyId: number) {
  const res = await axios.get(`${API_BASE_URL}/families/${familyId}/medications/active`);

  return res.data.data;
}


/**
 * Fetch all medications for a member
 */
export async function fetchMedications(memberId: number): Promise<Medication[]> {
  const res = await axios.get(`${API_BASE_URL}/members/${memberId}/medications`);
  return res.data.data || [];
}

/**
 * Create a new medication for a member
 */
export async function createMedication(memberId: number, data: MedicationCreateData): Promise<Medication> {
  const res = await axios.post(`${API_BASE_URL}/members/${memberId}/medications`, data);
  return res.data.data;
}

/**
 * Update an existing medication
 */
export async function updateMedication(medicationId: number, data: MedicationCreateData): Promise<Medication> {
  const res = await axios.put(`${API_BASE_URL}/members/${medicationId}/medications`, data);
  return res.data.data;
}

/**
 * Delete a medication
 */
export async function deleteMedication(medicationId: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/members/${medicationId}/medications`);
}

