import { MedicalRecord } from '../entities';
import { AppointmentResponseDto } from '@modules/appointments/dtos';
import { PrescriptionItemResponse } from '@modules/prescription-items/dtos';

export class MedicalRecordResponseDto {
  id: number;
  diagnosis: string;
  symptoms: string;
  notes: string;
  totalCost: number;
  createdAt: Date;

  appointment?: AppointmentResponseDto;

  medicines?: PrescriptionItemResponse[];

  static fromEntity(entity: MedicalRecord): MedicalRecordResponseDto {
    const dto = new MedicalRecordResponseDto();
    dto.id = entity.id;
    dto.diagnosis = entity.diagnosis;
    dto.symptoms = entity.symptoms || '';
    dto.notes = entity.notes || '';

    dto.totalCost = entity.total_cost ? Number(entity.total_cost) : 0;
    dto.createdAt = entity.createdAt;

    if (entity.appointment) {
      dto.appointment = AppointmentResponseDto.fromEntity(entity.appointment);
    }

    if (entity.prescription && entity.prescription.items) {
      dto.medicines = entity.prescription.items.map((item) => PrescriptionItemResponse.fromEntity(item));
    } else {
      dto.medicines = [];
    }

    return dto;
  }
}
