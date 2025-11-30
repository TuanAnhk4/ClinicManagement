import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';

import { RolesGuard } from '@common/guards';
import { Roles, GetUser } from '@common/decorators';

import { User } from '@modules/users/entities';
import { UserRole } from '@modules/users/enums';

import { DoctorSchedulesService } from './doctor-schedules.service';
import { CreateScheduleDto, UpdateScheduleDto, ScheduleResponseDto } from './dtos';

@Controller('doctor-schedules')
@UseGuards(RolesGuard)
export class DoctorSchedulesController {
  constructor(private readonly schedulesService: DoctorSchedulesService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  async create(@Body() createDto: CreateScheduleDto, @GetUser() doctor: User): Promise<ScheduleResponseDto> {
    const schedule = await this.schedulesService.create(createDto, doctor);
    return ScheduleResponseDto.fromEntity(schedule);
  }

  @Get('me')
  @Roles(UserRole.DOCTOR)
  async findMySchedules(@GetUser() doctor: User): Promise<ScheduleResponseDto[]> {
    const schedules = await this.schedulesService.findAllByDoctorId(doctor.id);
    return schedules.map((s) => ScheduleResponseDto.fromEntity(s));
  }

  @Get('doctor/:doctorId')
  async findSchedulesByDoctorId(@Param('doctorId', ParseIntPipe) doctorId: number): Promise<ScheduleResponseDto[]> {
    const schedules = await this.schedulesService.findAllByDoctorId(doctorId);
    return schedules.map((s) => ScheduleResponseDto.fromEntity(s));
  }

  @Patch(':id')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateScheduleDto,
  ): Promise<ScheduleResponseDto> {
    // Lưu ý: Để bảo mật chặt chẽ hơn (ngăn BS A sửa lịch BS B),
    // bạn có thể thêm logic check owner trong Service hoặc dùng OwnerGuard sau này.
    const schedule = await this.schedulesService.update(id, updateDto);
    return ScheduleResponseDto.fromEntity(schedule);
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.schedulesService.remove(id);
  }
}
