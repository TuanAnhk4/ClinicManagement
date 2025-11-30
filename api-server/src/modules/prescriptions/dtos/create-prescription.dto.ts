import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePrescriptionDto {
  @IsNotEmpty()
  @IsNumber()
  medicalRecordId: number;
}
