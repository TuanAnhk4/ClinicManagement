import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';

import { Appointment } from './entities';
import { AppointmentStatus } from './enums';
import { CreateAppointmentDto } from './dtos';

import { User } from '@modules/users/entities';
import { UserRole } from '@modules/users/enums';

const APPOINTMENT_DURATION_MINUTES = 30;
const APPOINTMENT_RELATIONS = ['patient', 'doctor'];

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, patient: User): Promise<Appointment> {
    const { doctorId, appointmentTime, reason } = createAppointmentDto;

    const doctor = await this.usersRepository.findOneBy({ id: doctorId });
    if (!doctor || doctor.role !== UserRole.DOCTOR) {
      throw new NotFoundException(`Không tìm thấy bác sĩ với ID ${doctorId}`);
    }

    const startTime = new Date(appointmentTime);
    const endTime = new Date(startTime.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);

    const existingAppointment = await this.appointmentsRepository.findOne({
      where: {
        doctor: { id: doctorId },
        status: AppointmentStatus.CONFIRMED,
        appointmentTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (existingAppointment) {
      throw new ConflictException('Khung giờ này đã có người đặt. Vui lòng chọn giờ khác.');
    }

    const newAppointment = this.appointmentsRepository.create({
      appointmentTime: startTime,
      endTime: endTime,
      reason: reason ?? null,
      status: AppointmentStatus.CONFIRMED,
      patient: patient,
      doctor: doctor,
    });

    return this.appointmentsRepository.save(newAppointment);
  }

  async findOne(id: number, user: User): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: APPOINTMENT_RELATIONS,
    });

    if (!appointment) {
      throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${id}`);
    }

    if (user.role === UserRole.ADMIN) {
      return appointment;
    }

    if (user.role === UserRole.DOCTOR && appointment.doctorId === user.id) {
      return appointment;
    }

    if (user.role === UserRole.PATIENT && appointment.patientId === user.id) {
      return appointment;
    }

    throw new ForbiddenException('Bạn không có quyền xem chi tiết lịch hẹn này.');
  }

  async findAllForPatient(patientId: number): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor'],
      order: { appointmentTime: 'DESC' },
    });
  }

  async findAllForDoctor(doctorId: number): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['patient'],
      order: { appointmentTime: 'ASC' },
    });
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      // Lấy kèm thông tin Patient và Doctor để hiển thị tên trên bảng Admin
      relations: ['patient', 'doctor'],

      // Sắp xếp: Mới nhất lên đầu để Admin dễ theo dõi
      order: { appointmentTime: 'DESC' },
    });
  }

  async cancel(id: number, currentUser: User): Promise<Appointment> {
    const appointment = await this.findOne(id, currentUser);

    if (currentUser.role !== UserRole.ADMIN && appointment.patientId !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền hủy lịch hẹn này.');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentsRepository.save(appointment);
  }
}
