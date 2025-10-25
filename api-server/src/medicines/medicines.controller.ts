// src/medicines/medicines.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('medicines')
@UseGuards(AuthGuard('jwt')) // Cần đăng nhập để xem danh mục thuốc
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Get()
  findAll() {
    return this.medicinesService.findAll();
  }
}
