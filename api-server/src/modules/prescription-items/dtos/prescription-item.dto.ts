import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class PrescriptionItemDto {
  @IsNotEmpty()
  @IsNumber()
  medicineId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Số lượng thuốc phải lớn hơn 0' })
  quantity: number;

  @IsNotEmpty({ message: 'Vui lòng nhập liều dùng' })
  @IsString()
  dosage: string;
}
