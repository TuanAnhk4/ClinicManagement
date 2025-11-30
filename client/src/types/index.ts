

export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  
  // --- CẬP NHẬT CHO BÁC SĨ ---
  specialtyId?: number | null;

  // --- CẬP NHẬT CHO BỆNH NHÂN (ML Features) ---
  date_of_birth?: string | null; // API trả về dạng chuỗi ISO (YYYY-MM-DD)
  gender?: Gender | null;
  bmi?: number | null;
  is_smoker?: boolean;
  children?: number;
}

export interface Specialty {
  id: number;
  name: string;
  description?: string | null;
  
  // --- CẬP NHẬT ---
  base_cost: number; // Phí khám cơ bản
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Appointment {
  id: number;
  appointmentTime: string;
  endTime: string;
  reason?: string;
  status: AppointmentStatus;
  patient: User;
  doctor: User;
}

// --- BỔ SUNG CÁC ĐỊNH NGHĨA DƯỚI ĐÂY ---

export interface Medicine {
  id: number;
  name: string;
  unit: string;
  description?: string | null; // Cho phép description có thể là null
  // --- CẬP NHẬT ---
  price: number; // Đơn giá thuốc
}

export interface PrescriptionItem {
  id: number;
  quantity: number;
  dosage: string;
  medicine: Medicine; // Thông tin thuốc được lồng vào
  // Có thể thêm prescriptionId nếu cần
}

export interface Prescription {
  id: number;
  createdAt: string;
  items: PrescriptionItem[]; // Danh sách các chi tiết đơn thuốc
}

export interface MedicalRecord {
  id: number;
  diagnosis: string;
  symptoms?: string | null; // Cho phép null
  notes?: string | null;    // Cho phép null
  appointment: Appointment; // Thông tin cuộc hẹn được lồng vào
  prescription?: Prescription | null; // Đơn thuốc có thể có hoặc không

  total_cost?: number | null; // Tổng chi phí khám + thuốc
}