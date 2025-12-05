import { User } from './users';
import { UserRole, Gender } from './enums';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user?: User;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: UserRole;

  date_of_birth?: string;
  gender?: Gender;
  bmi?: number;
  is_smoker?: boolean;
  children?: number;
}


export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

// Thêm Payload cho reset pass
export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
