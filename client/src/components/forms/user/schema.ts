import { z } from 'zod';
import { UserRole, Gender } from '@/types/enums';
import { REGEX } from '@/constants/regex';

export const userFormSchema = z.object({
  fullName: z.string()
    .min(1, { message: 'Họ tên là bắt buộc' })
    .max(100, { message: 'Họ tên không được quá 100 ký tự' }),

  email: z.string()
    .min(1, { message: 'Email là bắt buộc' })
    .email({ message: 'Email không đúng định dạng' }),

  password: z.string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    .optional()
    .or(z.literal('')),

  phoneNumber: z.string()
    .regex(REGEX.PHONE_VN, { message: 'Số điện thoại không hợp lệ' })
    .optional()
    .or(z.literal('')),

  // SỬA LỖI 1: Bỏ errorMap, dùng nativeEnum đơn giản
  role: z.nativeEnum(UserRole),

  // Dành cho Bác sĩ (Coerce: ép kiểu từ string -> number)
  specialtyId: z.coerce.number().optional(),

  // Dành cho Bệnh nhân
  date_of_birth: z.string().optional().or(z.literal('')),
  
  gender: z.nativeEnum(Gender).optional(),

  bmi: z.coerce.number().min(0).optional(),

  is_smoker: z.boolean().default(false),

  children: z.coerce.number().int().min(0).default(0),
});

// Infer type từ schema để dùng cho onSubmit
export type UserFormSchemaType = z.infer<typeof userFormSchema>;

export const defaultValues: UserFormSchemaType = {
  fullName: '',
  email: '',
  password: '',
  phoneNumber: '',
  role: UserRole.PATIENT,
  specialtyId: 0, 
  gender: Gender.MALE,
  bmi: 0,
  children: 0,
  is_smoker: false,
  date_of_birth: '',
};