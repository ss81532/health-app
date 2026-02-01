import axios from "axios";
import { API_BASE_URL } from "../config/api";





// Family returned from backend
export interface Family {
  id: number;
  name: string;
  members_count: number;
}

// Data sent when creating a family (no id)
export interface FamilyCreateData {
  name: string;
}

// Fetch all families
export async function fetchFamilies(): Promise<Family[]> {
  const response = await axios.get<Family[]>(`${API_BASE_URL}/families`);
  return response.data;
}

// Create a new family
export async function createFamily(data: FamilyCreateData): Promise<Family> {
  const response = await axios.post<Family>(`${API_BASE_URL}/families`, data);
  return response.data;
}

// Fetch a single family by ID
export async function fetchFamilyById(familyId: number): Promise<Family> {
  const res = await axios.get(`${API_BASE_URL}/families/${familyId}`);
  return res.data;
}