import { Controller, Post, Body, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dtos/create-medical-record.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('medical-records')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Bảo vệ tất cả API
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  /**
   * API cho Bác sĩ tạo hồ sơ khám bệnh và đơn thuốc
   */
  @Post()
  @Roles(UserRole.DOCTOR) // Chỉ Bác sĩ được tạo
  create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
    return this.medicalRecordsService.create(createMedicalRecordDto);
  }

  @Get('patient/:patientId')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN) // Chỉ Bác sĩ hoặc Admin được xem lịch sử của bệnh nhân bất kỳ
  findAllForPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.medicalRecordsService.findAllForPatient(patientId);
  }

  @Get('appointment/:appointmentId')
  // Ai được xem? Cần đảm bảo Bệnh nhân chỉ xem được của mình, hoặc Bác sĩ liên quan.
  // Tạm thời cho phép tất cả người dùng đã đăng nhập.
  // Cần thêm logic kiểm tra quyền sở hữu trong service sau.
  findByAppointmentId(@Param('appointmentId', ParseIntPipe) appointmentId: number) {
    return this.medicalRecordsService.findByAppointmentId(appointmentId);
  }
  // Thêm các API khác (ví dụ: GET /medical-records/appointment/:appointmentId) vào đây
}
