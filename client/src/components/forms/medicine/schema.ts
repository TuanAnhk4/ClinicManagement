import { z } from 'zod';

export const medicineSchema = z.object({
  // 1. Tên thuốc
  name: z.string()
    .min(1, { message: 'Tên thuốc không được để trống' })
    .max(100, { message: 'Tên thuốc quá dài (tối đa 100 ký tự)' }),

  // 2. Đơn vị tính (Viên, Vỉ, Chai...)
  unit: z.string()
    .min(1, { message: 'Đơn vị tính không được để trống' }),

  // 3. Giá tiền (Quan trọng cho ML)
  // Sử dụng coerce để ép kiểu string -> number tự động
  price: z.coerce
    .number()
    .min(0, { message: 'Giá thuốc không được âm' })
    .max(100000000, { message: 'Giá thuốc quá lớn, vui lòng kiểm tra lại' }),

  // 4. Mô tả
  description: z.string().optional().or(z.literal('')),
});

// Type inference
export type MedicineFormValues = z.infer<typeof medicineSchema>;

// Default values
export const defaultValues: MedicineFormValues = {
  name: '',
  unit: '',
  price: 0,
  description: '',
};