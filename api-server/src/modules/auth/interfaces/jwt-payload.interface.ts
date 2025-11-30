import { UserRole } from '@modules/users/enums';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}
