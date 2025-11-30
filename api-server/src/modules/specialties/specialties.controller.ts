import { Controller, Get, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';

import { RolesGuard } from '@common/guards';
import { Roles, Public } from '@common/decorators';

import { SpecialtiesService } from './specialties.service';
import { CreateSpecialtyDto, UpdateSpecialtyDto, SpecialtyResponseDto } from './dtos';

import { UserRole } from '@modules/users/enums';

@Controller('specialties')
@UseGuards(RolesGuard)
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Roles(UserRole.ADMIN)
  async create(@Body() createSpecialtyDto: CreateSpecialtyDto): Promise<SpecialtyResponseDto> {
    const specialty = await this.specialtiesService.create(createSpecialtyDto);
    return SpecialtyResponseDto.fromEntity(specialty);
  }

  @Public()
  @Get()
  async findAll(): Promise<SpecialtyResponseDto[]> {
    const specialties = await this.specialtiesService.findAll();

    return specialties.map((specialty) => SpecialtyResponseDto.fromEntity(specialty));
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SpecialtyResponseDto> {
    const specialty = await this.specialtiesService.findOne(id);
    return SpecialtyResponseDto.fromEntity(specialty);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpecialtyDto: UpdateSpecialtyDto,
  ): Promise<SpecialtyResponseDto> {
    const specialty = await this.specialtiesService.update(id, updateSpecialtyDto);
    return SpecialtyResponseDto.fromEntity(specialty);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.specialtiesService.remove(id);
  }
}
