import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Prescription } from './entities';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from './dtos';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
  ) {}

  async create(createDto: CreatePrescriptionDto): Promise<Prescription> {
    const existing = await this.prescriptionRepository.findOne({
      where: { medicalRecordId: createDto.medicalRecordId },
    });

    if (existing) {
      throw new ConflictException('Hồ sơ bệnh án này đã có đơn thuốc.');
    }

    const prescription = this.prescriptionRepository.create(createDto);
    return this.prescriptionRepository.save(prescription);
  }

  async findAll(): Promise<Prescription[]> {
    return this.prescriptionRepository.find({
      relations: ['items', 'items.medicine'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findOne({
      where: { id },
      relations: ['items', 'items.medicine'],
    });

    if (!prescription) {
      throw new NotFoundException(`Không tìm thấy đơn thuốc với ID ${id}`);
    }

    return prescription;
  }

  async update(id: number, updateDto: UpdatePrescriptionDto): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.preload({
      id: id,
      ...updateDto,
    });

    if (!prescription) {
      throw new NotFoundException(`Không tìm thấy đơn thuốc với ID ${id}`);
    }

    return this.prescriptionRepository.save(prescription);
  }

  async remove(id: number): Promise<void> {
    const result = await this.prescriptionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy đơn thuốc với ID ${id}`);
    }
  }
}
