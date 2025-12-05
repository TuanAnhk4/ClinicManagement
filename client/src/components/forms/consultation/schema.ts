import { z } from 'zod';

const prescriptionItemSchema = z.object({
  // 1. Bỏ object { invalid_type_error } đi để tránh lỗi type unknown
  medicineId: z.coerce.number()
    .min(1, { message: 'Vui lòng chọn thuốc' }),

  quantity: z.coerce.number()
    .min(1, { message: 'Số lượng phải lớn hơn 0' }),

  dosage: z.string()
    .min(1, { message: 'Vui lòng nhập liều dùng' }),
});

export const consultationSchema = z.object({
  symptoms: z.string().optional(),
  
  diagnosis: z.string()
    .min(1, { message: 'Chẩn đoán không được để trống' })
    .max(1000, { message: 'Chẩn đoán quá dài' }),

  notes: z.string().optional(),

  prescriptionItems: z.array(prescriptionItemSchema).optional(),
});

// Infer type
export type ConsultationFormSchemaType = z.infer<typeof consultationSchema>;

export const defaultValues: ConsultationFormSchemaType = {
  symptoms: '',
  diagnosis: '',
  notes: '',
  prescriptionItems: [],
};