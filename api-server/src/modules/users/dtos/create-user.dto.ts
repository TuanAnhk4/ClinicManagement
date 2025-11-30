import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { UserRole, Gender } from '../enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  // Doctor
  @IsOptional()
  @IsNumber()
  specialtyId?: number;

  // patient - ML Features
  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh phải là định dạng ISO (YYYY-MM-DD)' })
  date_of_birth?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
  gender?: Gender;

  @IsOptional()
  @IsNumber()
  bmi?: number;

  @IsOptional()
  @IsBoolean()
  is_smoker?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  children?: number;
}
