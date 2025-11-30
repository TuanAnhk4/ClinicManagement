import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Specialty } from './entities';
import { CreateSpecialtyDto, UpdateSpecialtyDto } from './dtos';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty)
    private specialtyRepository: Repository<Specialty>,
  ) {}

  async create(createSpecialtyDto: CreateSpecialtyDto): Promise<Specialty> {
    const existingSpecialty = await this.specialtyRepository.findOne({
      where: { name: createSpecialtyDto.name },
    });

    if (existingSpecialty) {
      throw new ConflictException(`Chuyên khoa '${createSpecialtyDto.name}' đã tồn tại.`);
    }

    const specialty = this.specialtyRepository.create(createSpecialtyDto);
    return this.specialtyRepository.save(specialty);
  }

  async findAll(): Promise<Specialty[]> {
    return this.specialtyRepository.find({
      order: { name: 'ASC' },
      relations: ['doctors'],
    });
  }

  async findOne(id: number): Promise<Specialty> {
    const specialty = await this.specialtyRepository.findOne({
      where: { id },
      relations: ['doctors'],
    });

    if (!specialty) {
      throw new NotFoundException(`Không tìm thấy chuyên khoa với ID ${id}`);
    }

    return specialty;
  }

  async update(id: number, updateSpecialtyDto: UpdateSpecialtyDto): Promise<Specialty> {
    const specialty = await this.specialtyRepository.preload({
      id: id,
      ...updateSpecialtyDto,
    });

    if (!specialty) {
      throw new NotFoundException(`Không tìm thấy chuyên khoa với ID ${id}`);
    }

    return this.specialtyRepository.save(specialty);
  }

  async remove(id: number): Promise<void> {
    const specialty = await this.findOne(id);

    try {
      await this.specialtyRepository.remove(specialty);
    } catch (_error) {
      throw new ConflictException('Không thể xóa chuyên khoa này vì đang có Bác sĩ trực thuộc.');
    }
  }
}
