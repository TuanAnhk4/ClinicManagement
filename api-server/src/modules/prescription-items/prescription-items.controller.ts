import { Controller, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';

import { RolesGuard } from '@common/guards';
import { Roles } from '@common/decorators';

import { PrescriptionItemsService } from './prescription-items.service';
import { UpdatePrescriptionItemDto, PrescriptionItemResponse } from './dtos';

import { UserRole } from '@modules/users/enums';

@Controller('prescription-items')
@UseGuards(RolesGuard)
export class PrescriptionItemsController {
  constructor(private readonly prescriptionItemsService: PrescriptionItemsService) {}

  @Patch(':id')
  @Roles(UserRole.DOCTOR)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdatePrescriptionItemDto) {
    const item = await this.prescriptionItemsService.update(id, updateDto);
    return PrescriptionItemResponse.fromEntity(item);
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prescriptionItemsService.remove(id);
  }
}
