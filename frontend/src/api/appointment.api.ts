import { API_BASE_URL } from "../config/api";
import axios from "axios";

export interface CreateAppointmentDto {
  title: string;
  hospital: string;
  date: string;
  time: string;
  notes?: string;
  familyId: number;
}
export async function fetchUpcomingAppointments(familyId: number) {
  const response = await fetch(
    `${API_BASE_URL}/appointments/upcoming?familyId=${familyId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return response.json();
}

export async function fetchAllAppointments(familyId: number) {
  const response = await fetch(
    `${API_BASE_URL}/appointments?familyId=${familyId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return response.json();
}
export const createAppointment = async (
  data: CreateAppointmentDto
) => {
  const response = await axios.post(
    `${API_BASE_URL}/appointments/create`,
    data
  );
  return response.data;
};

export async function deleteAppointment(appointmentId: number) {
  const res = await axios.delete(`${API_BASE_URL}/appointments/${appointmentId}`);
  return res.data;
}

export async function updateAppointment(appointmentId: number, data: any) {
  const res = await axios.put(`${API_BASE_URL}/appointments/${appointmentId}`, data);
  return res.data;
}