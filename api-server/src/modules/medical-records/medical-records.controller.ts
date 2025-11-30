import { Controller, Post, Body, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';

import { RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';

import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dtos';

import { MedicalRecordResponseDto } from './dtos';

import { UserRole } from '@modules/users/enums';

@Controller('medical-records')
@UseGuards(RolesGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  async create(@Body() createMedicalRecordDto: CreateMedicalRecordDto): Promise<MedicalRecordResponseDto> {
    const record = await this.medicalRecordsService.create(createMedicalRecordDto);
    return MedicalRecordResponseDto.fromEntity(record);
  }

  @Get('patient/:patientId')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN)
  async findAllForPatient(@Param('patientId', ParseIntPipe) patientId: number): Promise<MedicalRecordResponseDto[]> {
    const records = await this.medicalRecordsService.findAllForPatient(patientId);
    return records.map((record) => MedicalRecordResponseDto.fromEntity(record));
  }

  @Get('appointment/:appointmentId')
  async findByAppointmentId(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ): Promise<MedicalRecordResponseDto> {
    const record = await this.medicalRecordsService.findByAppointmentId(appointmentId);
    return MedicalRecordResponseDto.fromEntity(record);
  }
}
