import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PrescriptionItemDto {
  @IsNumber() medicineId: number;
  @IsNumber() quantity: number;
  @IsString() dosage: string; // Hướng dẫn sử dụng, ví dụ: "Sáng 1 viên, tối 1 viên sau ăn"
}

export class CreateMedicalRecordDto {
  @IsNumber() @IsNotEmpty() appointmentId: number;
  @IsString() @IsNotEmpty() diagnosis: string;
  @IsString() symptoms?: string;
  @IsString() notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Type(() => PrescriptionItemDto)
  prescriptionItems?: PrescriptionItemDto[]; // Danh sách các thuốc được kê
}
