export interface PrescriptionItem {
  id?: number; 
  
  medicineName: string;
  unit: string;
  quantity: number;
  dosage: string;
  price: number;
  amount: number;
}

export interface UpdatePrescriptionItemPayload {
  quantity?: number;
  dosage?: string;
}

export interface CreatePrescriptionItemPayload {
  medicineId: number;
  quantity: number;
  dosage: string;
}