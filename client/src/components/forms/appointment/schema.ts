import { z } from 'zod';

/**
 * Schema Validation cho Form Đặt Lịch
 */
export const bookingSchema = z.object({
  // 1. Chuyên khoa
  specialtyId: z.coerce.number()
    .min(1, { message: 'Vui lòng chọn chuyên khoa' })
    .optional(),

  // 2. Bác sĩ (SỬA LỖI TẠI ĐÂY)
  // Bỏ object cấu hình bên trong number()
  doctorId: z.coerce.number()
    .min(1, { message: 'Vui lòng chọn bác sĩ' }),

  // 3. Thời gian khám
  appointmentTime: z.string()
    .min(1, { message: 'Vui lòng chọn ngày và giờ khám' })
    .refine((dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      return date > now;
    }, { message: 'Thời gian khám phải ở trong tương lai' }),

  // 4. Lý do khám
  reason: z.string()
    .max(500, { message: 'Lý do khám không được quá 500 ký tự' })
    .optional()
    .or(z.literal('')),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const defaultValues: BookingFormValues = {
  specialtyId: 0,
  doctorId: 0,
  appointmentTime: '',
  reason: '',
};