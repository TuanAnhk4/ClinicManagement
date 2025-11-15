import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Appointment } from 'src/appointments/entities/appointment.entity'; // Import Appointment
import { MedicalRecord } from 'src/medical-records/entities/medical-record.entity'; // Import MedicalRecord
import { User } from 'src/users/entities/user.entity'; // Import User (để lấy chuyên khoa)
import { UsersModule } from 'src/users/users.module'; // Import UsersModule
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    // Đăng ký các Entity mà DashboardService sẽ cần truy vấn
    TypeOrmModule.forFeature([
      Appointment,
      MedicalRecord,
      User, // Cần User để join lấy thông tin bác sĩ/chuyên khoa
      // Thêm các Entity khác nếu bạn cần thống kê từ chúng
    ]),
    UsersModule, // Import UsersModule nếu DashboardService cần dùng UsersService
    HttpModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
