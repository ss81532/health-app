// export interface Appointment {
//   id: number;
//   member_id: number;
//   doctor_name: string;
//   hospital_name: string;
//   appointment_date: string;
//   reason?: string;
//   status: 'scheduled' | 'completed' | 'cancelled';
//   created_at?: string;
// }

export interface Appointment {
  id: number;
  family_id?: number;
  member_id?: number;
  doctor_name?: string | null;
  hospital_name?: string | null;
  appointment_date?: string | Date | null;
  reason?: string | null;
  notes?: string | null;
  status?: "scheduled" | "completed" | "cancelled" | null;
}