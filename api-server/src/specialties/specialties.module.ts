import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialty } from './entities/specialty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Specialty])], // Đăng ký Specialty Entity
  // Bạn có thể thêm Controller và Service sau này nếu cần quản lý chuyên khoa
  providers: [],
  exports: [TypeOrmModule], // Export để module khác có thể dùng SpecialtyRepository nếu cần
})
export class SpecialtiesModule {}
