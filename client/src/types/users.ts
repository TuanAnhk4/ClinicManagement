import { UserRole, Gender } from './enums';
import { Specialty } from './specialties';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;

  specialtyId?: number | null;
  specialty?: Specialty | null;

  date_of_birth?: string | null; 
  gender?: Gender | null;
  bmi?: number | null;
  is_smoker?: boolean;
  children?: number;

  // Audit (Optional)
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  phoneNumber?: string;
  specialtyId?: number;

  //ml
  date_of_birth?: string;
  gender?: Gender;
  bmi?: number;
  is_smoker?: boolean;
  children?: number;
}
