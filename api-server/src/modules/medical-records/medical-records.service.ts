import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { MedicalRecord } from './entities/medical-record.entity';
import { CreateMedicalRecordDto } from './dtos';

import { Appointment } from '@modules/appointments/entities';
import { AppointmentStatus } from '@modules/appointments/enums';
import { Prescription } from '@modules/prescriptions/entities';
import { PrescriptionItem } from '@modules/prescription-items/entities';
import { Medicine } from '@modules/medicines/entities';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async create(createDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    const { appointmentId, diagnosis, symptoms, notes, prescriptionItems } = createDto;

    return this.entityManager.transaction(async (transactionManager) => {
      const appointment = await transactionManager.findOne(Appointment, {
        where: { id: appointmentId },
        relations: ['doctor', 'doctor.specialty'],
      });

      if (!appointment) {
        throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${appointmentId}`);
      }
      if (appointment.status !== AppointmentStatus.CONFIRMED) {
        throw new BadRequestException('Lịch hẹn này không ở trạng thái có thể khám (Phải là CONFIRMED).');
      }

      const baseCost = Number(appointment.doctor?.specialty?.base_cost || 0);

      const medicalRecord = transactionManager.create(MedicalRecord, {
        diagnosis,
        symptoms,
        notes,
        appointment,
      });
      const savedMedicalRecord = await transactionManager.save(medicalRecord);

      let totalMedicineCost = 0;

      if (prescriptionItems && prescriptionItems.length > 0) {
        const prescription = transactionManager.create(Prescription, {
          medicalRecord: savedMedicalRecord,
        });
        const savedPrescription = await transactionManager.save(prescription);

        for (const itemDto of prescriptionItems) {
          const medicine = await transactionManager.findOne(Medicine, {
            where: { id: itemDto.medicineId },
          });

          if (!medicine) {
            throw new NotFoundException(`Không tìm thấy thuốc với ID ${itemDto.medicineId}`);
          }

          const price = Number(medicine.price);
          const itemCost = price * itemDto.quantity;

          totalMedicineCost += itemCost;

          const prescriptionItem = transactionManager.create(PrescriptionItem, {
            quantity: itemDto.quantity,
            dosage: itemDto.dosage,
            prescription: savedPrescription,
            medicine: medicine,
          });
          await transactionManager.save(prescriptionItem);
        }
      }

      const totalCost = baseCost + totalMedicineCost;

      savedMedicalRecord.total_cost = totalCost;
      await transactionManager.save(savedMedicalRecord);

      appointment.status = AppointmentStatus.COMPLETED;
      await transactionManager.save(appointment);

      return savedMedicalRecord;
    });
  }

  async findAllForPatient(patientId: number): Promise<MedicalRecord[]> {
    return this.entityManager.find(MedicalRecord, {
      where: { appointment: { patient: { id: patientId } } },
      relations: ['appointment', 'appointment.doctor'],
      order: { id: 'DESC' },
    });
  }

  async findByAppointmentId(appointmentId: number): Promise<MedicalRecord> {
    const record = await this.entityManager.findOne(MedicalRecord, {
      where: { appointment: { id: appointmentId } },
      relations: [
        'appointment',
        'appointment.doctor',
        'appointment.doctor.specialty',
        'prescription',
        'prescription.items',
        'prescription.items.medicine',
      ],
    });

    if (!record) {
      throw new NotFoundException(`Không tìm thấy hồ sơ khám bệnh nào cho lịch hẹn ID ${appointmentId}`);
    }
    return record;
  }
}
