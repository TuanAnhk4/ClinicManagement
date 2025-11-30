import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PrescriptionItem } from './entities';
import { UpdatePrescriptionItemDto } from './dtos';

@Injectable()
export class PrescriptionItemsService {
  constructor(
    @InjectRepository(PrescriptionItem)
    private prescriptionItemRepository: Repository<PrescriptionItem>,
  ) {}

  async update(id: number, updateDto: UpdatePrescriptionItemDto): Promise<PrescriptionItem> {
    const item = await this.prescriptionItemRepository.preload({
      id: id,
      ...updateDto,
    });

    if (!item) {
      throw new NotFoundException(`Không tìm thấy dòng thuốc với ID ${id}`);
    }

    return this.prescriptionItemRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.prescriptionItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy dòng thuốc với ID ${id}`);
    }
  }
}
