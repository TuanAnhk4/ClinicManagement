import { IsNotEmpty, IsInt, Min, Max, Matches, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty({ message: 'Vui lòng chọn ngày trong tuần' })
  @IsInt()
  @Min(0, { message: 'Ngày không hợp lệ (0 = Chủ Nhật)' })
  @Max(6, { message: 'Ngày không hợp lệ (6 = Thứ Bảy)' })
  dayOfWeek: number; // 0: Chủ Nhật, 1: Thứ 2 ... 6: Thứ 7

  @IsNotEmpty({ message: 'Vui lòng nhập giờ bắt đầu' })
  @IsString()
  // Regex kiểm tra định dạng HH:mm (Ví dụ: 08:30, 14:00)
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Giờ bắt đầu phải có định dạng HH:mm (ví dụ 08:00)',
  })
  startTime: string;

  @IsNotEmpty({ message: 'Vui lòng nhập giờ kết thúc' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Giờ kết thúc phải có định dạng HH:mm (ví dụ 17:00)',
  })
  endTime: string;
}
