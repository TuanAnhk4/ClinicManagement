import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { User, UserRole } from 'src/users/entities/user.entity';

const APPOINTMENT_DURATION_MINUTES = 30;

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Hàm CREATE đã được thêm các console.log để gỡ lỗi
   */
  async create(createAppointmentDto: CreateAppointmentDto, patient: User): Promise<Appointment | null> {
    // Sửa lại kiểu trả về cho an toàn
    const { doctorId, appointmentTime, reason } = createAppointmentDto;

    // Các bước kiểm tra bác sĩ và trùng lịch giữ nguyên...
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
      throw new ConflictException('Khung giờ này đã có người đặt.');
    }

    // --- THAY ĐỔI CHÍNH NẰM Ở ĐÂY ---
    try {
      const result = await this.appointmentsRepository.insert({
        appointmentTime: startTime,
        endTime,
        reason: reason ?? null,
        status: AppointmentStatus.CONFIRMED,
        patient: { id: patient.id }, // Chỉ cần truyền ID
        doctor: { id: doctorId }, // Chỉ cần truyền ID
      });

      // Lấy lại appointment vừa tạo để trả về đầy đủ thông tin
      const newAppointmentId = (result.identifiers[0] as { id: number }).id;
      return this.appointmentsRepository.findOne({
        where: { id: newAppointmentId },
        relations: ['patient', 'doctor'],
      });
    } catch (error) {
      console.error('LỖI KHI INSERTDATABASE:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Appointment | null> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'], // Lấy kèm thông tin patient và doctor
    });
    if (!appointment) {
      // Quan trọng: Ném lỗi nếu không tìm thấy
      throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${id}`);
    }
    return appointment;
  }

  /**
   * Lấy tất cả lịch hẹn của một bệnh nhân cụ thể
   */
  async findAllForPatient(patientId: number): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor'],
      order: { appointmentTime: 'DESC' },
    });
  }

  /**
   * Lấy tất cả lịch hẹn của một bác sĩ cụ thể
   */
  async findAllForDoctor(doctorId: number): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['patient'],
      order: { appointmentTime: 'ASC' },
    });
  }

  /**
   * Hủy một lịch hẹn
   */
  async cancel(id: number, currentUser: User): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!appointment) {
      throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${id}`);
    }

    if (currentUser.role !== UserRole.ADMIN && appointment.patient.id !== currentUser.id) {
      throw new ForbiddenException('Bạn không có quyền hủy lịch hẹn này.');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentsRepository.save(appointment);
  }
}
