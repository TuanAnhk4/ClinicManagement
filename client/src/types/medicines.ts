export interface Medicine {
  id: number;
  name: string;
  unit: string;
  description?: string;
  price: number;
}

export interface CreateMedicinePayload {
  name: string;
  unit: string;
  description?: string;
  price: number;
}

export interface UpdateMedicinePayload {
  name?: string;
  unit?: string;
  description?: string;
  price?: number;
}
