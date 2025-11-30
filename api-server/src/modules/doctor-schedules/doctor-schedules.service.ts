import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';

import { DoctorSchedule } from './entities';
import { User } from '@modules/users/entities';

import { CreateScheduleDto, UpdateScheduleDto } from './dtos';

@Injectable()
export class DoctorSchedulesService {
  constructor(
    @InjectRepository(DoctorSchedule)
    private scheduleRepository: Repository<DoctorSchedule>,
  ) {}

  async create(createDto: CreateScheduleDto, doctor: User): Promise<DoctorSchedule> {
    if (createDto.startTime >= createDto.endTime) {
      throw new BadRequestException('Giờ bắt đầu phải trước giờ kết thúc.');
    }

    const overlappingSchedule = await this.scheduleRepository.findOne({
      where: {
        doctorId: doctor.id,
        dayOfWeek: createDto.dayOfWeek,
        startTime: LessThan(createDto.endTime),
        endTime: MoreThan(createDto.startTime),
      },
    });

    if (overlappingSchedule) {
      throw new ConflictException('Khung giờ này bị trùng với một lịch làm việc đã có.');
    }

    const schedule = this.scheduleRepository.create({
      ...createDto,
      doctor: doctor,
    });

    return this.scheduleRepository.save(schedule);
  }

  async findAllByDoctorId(doctorId: number): Promise<DoctorSchedule[]> {
    return this.scheduleRepository.find({
      where: { doctorId },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<DoctorSchedule> {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Không tìm thấy lịch làm việc với ID ${id}`);
    }
    return schedule;
  }

  async update(id: number, updateDto: UpdateScheduleDto): Promise<DoctorSchedule> {
    const schedule = await this.findOne(id); // Check tồn tại

    // Merge dữ liệu mới vào dữ liệu cũ để có bộ giờ hoàn chỉnh (nếu updateDto chỉ gửi 1 trường)
    const newStartTime = updateDto.startTime ?? schedule.startTime;
    const newEndTime = updateDto.endTime ?? schedule.endTime;
    const newDayOfWeek = updateDto.dayOfWeek ?? schedule.dayOfWeek;

    if (newStartTime >= newEndTime) {
      throw new BadRequestException('Giờ bắt đầu phải trước giờ kết thúc.');
    }

    // 2. Kiểm tra trùng lịch (Loại trừ chính bản thân lịch đang sửa: id != id)
    const overlapping = await this.scheduleRepository.findOne({
      where: {
        id: Not(id), // Quan trọng: Không check với chính nó
        doctorId: schedule.doctorId,
        dayOfWeek: newDayOfWeek,
        startTime: LessThan(newEndTime),
        endTime: MoreThan(newStartTime),
      },
    });

    if (overlapping) {
      throw new ConflictException('Cập nhật thất bại: Khung giờ mới bị trùng lặp.');
    }

    Object.assign(schedule, updateDto);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: number): Promise<void> {
    const result = await this.scheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy lịch làm việc với ID ${id}`);
    }
  }
}
