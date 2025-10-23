import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// Kế thừa từ CreateUserDto nhưng tất cả các trường đều là tùy chọn (optional)
export class UpdateUserDto extends PartialType(CreateUserDto) {}
