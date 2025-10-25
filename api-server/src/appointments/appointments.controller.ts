import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { GetUser } from '@auth/get-user.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'), RolesGuard) // Áp dụng bảo vệ cho tất cả các API
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * API cho Bệnh nhân tạo một lịch hẹn mới.
   */
  @Post()
  @Roles(UserRole.PATIENT) // Chỉ Bệnh nhân mới được đặt lịch
  create(@Body() createAppointmentDto: CreateAppointmentDto, @GetUser() patient: User) {
    // console.log('--- EXECUTING: AppointmentsController -> create() ---');
    return this.appointmentsService.create(createAppointmentDto, patient);
  }

  /**
   * API cho Bệnh nhân lấy danh sách các lịch hẹn của chính mình.
   */
  @Get('patient/me')
  @Roles(UserRole.PATIENT)
  findAllForCurrentPatient(@GetUser() patient: User) {
    // console.log('--- EXECUTING: AppointmentsController -> findAllForCurrentPatient() ---');
    return this.appointmentsService.findAllForPatient(patient.id);
  }

  /**
   * API cho Bác sĩ lấy danh sách các lịch hẹn của chính mình.
   */
  @Get('doctor/me')
  @Roles(UserRole.DOCTOR)
  findAllForCurrentDoctor(@GetUser() doctor: User) {
    // console.log('--- EXECUTING: AppointmentsController -> findAllForCurrentDoctor() ---');
    return this.appointmentsService.findAllForDoctor(doctor.id);
  }

  /**
   * API (công khai cho người đã đăng nhập) để xem lịch của một bác sĩ cụ thể.
   * Bất kỳ ai cũng có thể xem để chọn lịch.
   */
  @Get('doctor/:id')
  findAllForDoctor(@Param('id', ParseIntPipe) id: number) {
    // console.log('--- EXECUTING: AppointmentsController -> findAllForDoctor() ---');
    return this.appointmentsService.findAllForDoctor(id);
  }

  /**
   * API cho Bệnh nhân (hoặc Admin) hủy một lịch hẹn.
   */
  @Patch(':id/cancel')
  @Roles(UserRole.PATIENT, UserRole.ADMIN) // Bệnh nhân hoặc Admin có thể hủy
  cancel(@Param('id', ParseIntPipe) id: number, @GetUser() currentUser: User) {
    // console.log('--- EXECUTING: AppointmentsController -> cancel() ---');
    return this.appointmentsService.cancel(id, currentUser);
  }

  @Get(':id')
  // Ai được xem? Có thể thêm @Roles nếu cần giới hạn
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }
}
