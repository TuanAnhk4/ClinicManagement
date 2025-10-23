import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  role: UserRole;
}
