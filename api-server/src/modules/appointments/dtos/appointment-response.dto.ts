import { AppointmentStatus } from '../enums';
import { Appointment } from '../entities';

import { UserResponseDto } from '@modules/users/dtos';

export class AppointmentResponseDto {
  id: number;
  appointmentTime: Date;
  endTime: Date;
  reason: string;
  status: AppointmentStatus;
  patient?: UserResponseDto;
  doctor?: UserResponseDto;

  // --- HÀM TĨNH ĐỂ CHUYỂN ĐỔI (MAPPING) ---
  static fromEntity(entity: Appointment): AppointmentResponseDto {
    const dto = new AppointmentResponseDto();

    dto.id = entity.id;
    dto.appointmentTime = entity.appointmentTime;
    dto.endTime = entity.endTime;
    dto.reason = entity.reason || '';
    dto.status = entity.status;

    if (entity.patient) {
      dto.patient = {
        id: entity.patient.id,
        email: entity.patient.email,
        fullName: entity.patient.fullName,
        phoneNumber: entity.patient.phoneNumber || null,
        role: entity.patient.role,
        specialtyId: entity.patient.specialtyId,
        //ml
        gender: entity.patient.gender,
        date_of_birth: entity.patient.date_of_birth ? new Date(entity.patient.date_of_birth) : null,
      } as UserResponseDto;
    }

    if (entity.doctor) {
      dto.doctor = {
        id: entity.doctor.id,
        email: entity.doctor.email,
        fullName: entity.doctor.fullName,
        phoneNumber: entity.doctor.phoneNumber || null,
        role: entity.doctor.role,
        specialtyId: entity.doctor.specialtyId,
      } as UserResponseDto;
    }

    return dto;
  }
}
