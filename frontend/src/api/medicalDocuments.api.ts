// src/api/medicalDocuments.api.ts
import axios from "axios";
import { API_BASE_URL } from "../config/api";

export interface MedicalDocument {
  id: number;
  member_id: number;
  document_name: string;
  document_type?: string;
  file_url: string;
  uploaded_at: string;
}


export async function fetchMedicalDocuments(memberId: number) {
  const res = await axios.get(`${API_BASE_URL}/medical-documents/member/${memberId}`);
  return res.data;
}

export async function uploadMedicalDocument(
  memberId: number,
  file: File
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("memberId", String(memberId));

  const res = await axios.post(
    `${API_BASE_URL}/medical-documents/upload`,
    formData
  );

  return res.data;
}

