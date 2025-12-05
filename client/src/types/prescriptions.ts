import { PrescriptionItem } from './prescription-items';

export interface Prescription {
  id: number;
  medicalRecordId: number;
  createdAt: string;
  
  items: PrescriptionItem[];
  totalAmount: number;
}

