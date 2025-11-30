import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'Vui lòng chọn bác sĩ' })
  @IsNumber()
  doctorId: number;

  @IsNotEmpty({ message: 'Vui lòng chọn giờ khám' })
  @IsDateString({}, { message: 'Thời gian hẹn không hợp lệ' })
  appointmentTime: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
