import { DoctorSchedule } from '../entities';

export class ScheduleResponseDto {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  doctorId: number;

  static fromEntity(entity: DoctorSchedule): ScheduleResponseDto {
    const dto = new ScheduleResponseDto();
    dto.id = entity.id;
    dto.dayOfWeek = entity.dayOfWeek;
    dto.doctorId = entity.doctorId;

    // Xử lý format giờ: Cắt bỏ phần giây nếu có (08:00:00 -> 08:00)
    dto.startTime = entity.startTime.length > 5 ? entity.startTime.slice(0, 5) : entity.startTime;
    dto.endTime = entity.endTime.length > 5 ? entity.endTime.slice(0, 5) : entity.endTime;

    return dto;
  }
}
