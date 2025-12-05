import { z } from 'zod';
import { REGEX } from '@/constants/regex';

// Danh sách tùy chọn cho Select (Dùng chung)
export const DAY_OPTIONS = [
  { label: 'Thứ Hai', value: 1 },
  { label: 'Thứ Ba', value: 2 },
  { label: 'Thứ Tư', value: 3 },
  { label: 'Thứ Năm', value: 4 },
  { label: 'Thứ Sáu', value: 5 },
  { label: 'Thứ Bảy', value: 6 },
  { label: 'Chủ Nhật', value: 0 },
];

/**
 * Schema Validation cho Lịch Làm Việc
 */
export const scheduleSchema = z.object({
  // 1. SỬA LỖI Ở ĐÂY:
  // Bỏ object { invalid_type_error... } đi.
  // Dùng min/max để báo lỗi nếu giá trị không nằm trong khoảng 0-6
  dayOfWeek: z.coerce.number()
    .min(0, { message: 'Vui lòng chọn ngày hợp lệ' })
    .max(6, { message: 'Vui lòng chọn ngày hợp lệ' }),

  // 2. Giờ bắt đầu
  startTime: z.string()
    .min(1, { message: 'Giờ bắt đầu là bắt buộc' })
    .regex(REGEX.TIME_24H, { message: 'Định dạng giờ không hợp lệ (HH:mm)' }),

  // 3. Giờ kết thúc
  endTime: z.string()
    .min(1, { message: 'Giờ kết thúc là bắt buộc' })
    .regex(REGEX.TIME_24H, { message: 'Định dạng giờ không hợp lệ (HH:mm)' }),
})
.refine((data) => {
  // Validate Logic: End phải lớn hơn Start
  return data.endTime > data.startTime;
}, {
  message: "Giờ kết thúc phải sau giờ bắt đầu",
  path: ["endTime"], // Hiển thị lỗi ở ô endTime
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;

export const defaultValues: ScheduleFormValues = {
  dayOfWeek: 1, // Mặc định Thứ 2
  startTime: '08:00',
  endTime: '17:00',
};