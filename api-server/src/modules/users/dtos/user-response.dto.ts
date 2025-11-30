import { UserRole, Gender } from '../enums';

export class UserResponseDto {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  role: UserRole;

  specialtyId?: number | null;

  date_of_birth?: Date | string | null;
  gender?: Gender | null;
  bmi?: number | null;
  is_smoker?: boolean;
  children?: number;
}
