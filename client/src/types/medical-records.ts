import { Appointment } from './appointments';
import { PrescriptionItem, CreatePrescriptionItemPayload } from './prescription-items';

export interface MedicalRecord {
  id: number;
  diagnosis: string;
  symptoms: string;
  notes: string;
  totalCost: number;
  createdAt: string;

  appointment?: Appointment;

  medicines?: PrescriptionItem[]; 
}

export interface CreateMedicalRecordPayload {
  appointmentId: number;
  diagnosis: string;
  symptoms?: string;
  notes?: string;
  
  prescriptionItems?: CreatePrescriptionItemPayload[];
}

export interface UpdateMedicalRecordPayload {
  diagnosis?: string;
  symptoms?: string;
  notes?: string;
}
