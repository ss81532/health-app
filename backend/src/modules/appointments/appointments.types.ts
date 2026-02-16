export interface Appointment {
  id: number;
  member_id: number;
  doctor_name: string;
  hospital_name: string;
  appointment_date: string;
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at?: string;
}