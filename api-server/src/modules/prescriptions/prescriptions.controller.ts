import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';

import { RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';
import { UserRole } from '@modules/users/enums';

import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto, UpdatePrescriptionDto, PrescriptionResponseDto } from './dtos';

@Controller('prescriptions')
@UseGuards(RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  async create(@Body() createDto: CreatePrescriptionDto): Promise<PrescriptionResponseDto> {
    const prescription = await this.prescriptionsService.create(createDto);
    return PrescriptionResponseDto.fromEntity(prescription);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async findAll(): Promise<PrescriptionResponseDto[]> {
    const prescriptions = await this.prescriptionsService.findAll();
    return prescriptions.map((p) => PrescriptionResponseDto.fromEntity(p));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PrescriptionResponseDto> {
    const prescription = await this.prescriptionsService.findOne(id);
    return PrescriptionResponseDto.fromEntity(prescription);
  }

  @Patch(':id')
  @Roles(UserRole.DOCTOR)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePrescriptionDto,
  ): Promise<PrescriptionResponseDto> {
    const prescription = await this.prescriptionsService.update(id, updateDto);
    return PrescriptionResponseDto.fromEntity(prescription);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.prescriptionsService.remove(id);
  }
}
