import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';

import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';

import { MedicinesService } from './medicines.service';
import { CreateMedicineDto, UpdateMedicineDto, MedicineResponseDto } from './dtos';

import { UserRole } from '@modules/users/enums';

@Controller('medicines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createMedicineDto: CreateMedicineDto): Promise<MedicineResponseDto> {
    const medicine = await this.medicinesService.create(createMedicineDto);
    return MedicineResponseDto.fromEntity(medicine);
  }

  @Get()
  async findAll(): Promise<MedicineResponseDto[]> {
    const medicines = await this.medicinesService.findAll();
    return medicines.map((med) => MedicineResponseDto.fromEntity(med));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MedicineResponseDto> {
    const medicine = await this.medicinesService.findOne(id);
    return MedicineResponseDto.fromEntity(medicine);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ): Promise<MedicineResponseDto> {
    const medicine = await this.medicinesService.update(id, updateMedicineDto);
    return MedicineResponseDto.fromEntity(medicine);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.medicinesService.remove(id);
  }
}
