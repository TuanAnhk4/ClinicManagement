import { AppointmentStatus } from './enums';
import { User } from './users';

export interface Appointment {
  id: number;
  appointmentTime: string;
  endTime: string;
  reason?: string;
  status: AppointmentStatus;
  
  patientId: number;
  patient?: User;
  
  doctorId: number;
  doctor?: User;

  isReminderSent?: boolean;
}

export interface CreateAppointmentPayload {
  doctorId: number;
  appointmentTime: string;
  reason?: string;
}

export interface UpdateAppointmentPayload {
  appointmentTime?: string;
  reason?: string;
  status?: AppointmentStatus;
}
