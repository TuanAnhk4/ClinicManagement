import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateSpecialtyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  // --- THÊM TRƯỜNG MỚI ---
  @IsNotEmpty()
  @IsNumber()
  @Min(0) // Phí không được âm
  base_cost: number;
}
