import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsNumber()
  doctorId: number;

  @IsNotEmpty()
  @IsDateString() // Dữ liệu ngày giờ gửi lên dưới dạng chuỗi ISO
  appointmentTime: string;

  @IsString()
  reason?: string;
}
