// src/api/members.api.ts
import axios from "axios";
import { API_BASE_URL } from "../config/api";

// src/api/members.api.ts

// Data returned from backend (includes id)
export interface Member {
  id: number;
  family_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO string
  gender: "male" | "female" | "other";
  created_at: string;
}

// Data sent to backend when creating a member (no id)
export interface MemberCreateData {
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO
  gender: "male" | "female" | "other";
}

export async function fetchMembers(familyId: number): Promise<Member[]> {
  const res = await axios.get(`${API_BASE_URL}/families/${familyId}/members`);
  return res.data.data; // <-- pick the array
}

export async function createMember(familyId: number, member: MemberCreateData) {
  const response = await axios.post<Member>(`${API_BASE_URL}/families/${familyId}/members`, member);
  return response.data;
}
