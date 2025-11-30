import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Medicine } from './entities/medicine.entity';
import { CreateMedicineDto, UpdateMedicineDto } from './dtos';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
  ) {}

  async create(createMedicineDto: CreateMedicineDto): Promise<Medicine> {
    const existing = await this.medicineRepository.findOne({
      where: { name: createMedicineDto.name },
    });
    if (existing) {
      throw new ConflictException(`Thuốc '${createMedicineDto.name}' đã tồn tại.`);
    }

    const medicine = this.medicineRepository.create(createMedicineDto);
    return this.medicineRepository.save(medicine);
  }

  async findAll(): Promise<Medicine[]> {
    return this.medicineRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Medicine> {
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    if (!medicine) {
      throw new NotFoundException(`Không tìm thấy thuốc với ID ${id}`);
    }
    return medicine;
  }

  async update(id: number, updateMedicineDto: UpdateMedicineDto): Promise<Medicine> {
    const medicine = await this.medicineRepository.preload({
      id: id,
      ...updateMedicineDto,
    });

    if (!medicine) {
      throw new NotFoundException(`Không tìm thấy thuốc với ID ${id}`);
    }

    return this.medicineRepository.save(medicine);
  }

  async remove(id: number): Promise<void> {
    const result = await this.medicineRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy thuốc với ID ${id}`);
    }
  }
}
