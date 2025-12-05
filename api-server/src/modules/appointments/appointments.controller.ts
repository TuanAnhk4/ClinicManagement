import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';

import { Roles, GetUser } from '@common/decorators';
import { RolesGuard } from '@common/guards';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, AppointmentResponseDto } from './dtos';

import { User } from '@modules/users/entities';
import { UserRole } from '@modules/users/enums';

@Controller('appointments')
@UseGuards(RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.PATIENT)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() patient: User,
  ): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentsService.create(createAppointmentDto, patient);

    return AppointmentResponseDto.fromEntity(appointment);
  }

  @Get('patient/me')
  @Roles(UserRole.PATIENT)
  async findAllForCurrentPatient(@GetUser() patient: User): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentsService.findAllForPatient(patient.id);

    return appointments.map((appt) => AppointmentResponseDto.fromEntity(appt));
  }

  @Get('doctor/me')
  @Roles(UserRole.DOCTOR)
  async findAllForCurrentDoctor(@GetUser() doctor: User): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentsService.findAllForDoctor(doctor.id);
    return appointments.map((appt) => AppointmentResponseDto.fromEntity(appt));
  }

  @Get('doctor/:id')
  async findAllForDoctor(@Param('id', ParseIntPipe) id: number): Promise<AppointmentResponseDto[]> {
    const appointments = await this.appointmentsService.findAllForDoctor(id);
    return appointments.map((appt) => AppointmentResponseDto.fromEntity(appt));
  }

  @Patch(':id/cancel')
  @Roles(UserRole.PATIENT, UserRole.ADMIN)
  async cancel(@Param('id', ParseIntPipe) id: number, @GetUser() currentUser: User): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentsService.cancel(id, currentUser);
    return AppointmentResponseDto.fromEntity(appointment);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<AppointmentResponseDto> {
    const appointment = await this.appointmentsService.findOne(id, user);
    return AppointmentResponseDto.fromEntity(appointment);
  }

  @Get()
  @Roles(UserRole.ADMIN) // Chỉ Admin được xem tất cả
  findAll() {
    return this.appointmentsService.findAll();
  }
}
