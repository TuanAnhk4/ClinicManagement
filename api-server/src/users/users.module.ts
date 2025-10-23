import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Đảm bảo import User entity đúng
import { UsersService } from './users.service';
import { UsersController } from './users.controller'; // (Cần thiết cho CRUD)

@Module({
  // ĐÂY LÀ DÒNG BẮT BUỘC ĐỂ ĐĂNG KÝ REPOSITORY (Lỗi của bạn nằm ở đây)
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
