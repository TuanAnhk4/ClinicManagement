import { z } from 'zod';

/**
 * Schema Validation cho Form Chuyên Khoa
 */
export const specialtySchema = z.object({
  name: z.string()
    .min(1, { message: 'Tên chuyên khoa không được để trống' })
    .max(100, { message: 'Tên chuyên khoa không được quá 100 ký tự' }),

  description: z.string().optional().or(z.literal('')),

  // SỬA LỖI TẠI ĐÂY:
  // 1. Bỏ object { invalid_type_error... } bên trong number()
  // 2. z.coerce.number() sẽ tự động ép chuỗi thành số
  base_cost: z.coerce
    .number() 
    .min(0, { message: 'Phí khám cơ bản không được âm' })
    .max(100000000, { message: 'Phí khám quá lớn, vui lòng kiểm tra lại' }),
});

export type SpecialtyFormValues = z.infer<typeof specialtySchema>;

export const defaultValues: SpecialtyFormValues = {
  name: '',
  description: '',
  base_cost: 0,
};