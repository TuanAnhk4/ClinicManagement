import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { CreateMedicalRecordDto } from './dtos/create-medical-record.dto';
import { Appointment, AppointmentStatus } from 'src/appointments/entities/appointment.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import { PrescriptionItem } from 'src/prescription-items/entities/prescription-item.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Medicine)
    private medicineRepository: Repository<Medicine>,
    @InjectEntityManager() // Inject EntityManager để quản lý transaction
    private entityManager: EntityManager,
  ) {}

  async create(createDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    const { appointmentId, diagnosis, symptoms, notes, prescriptionItems } = createDto;

    // Bắt đầu một transaction
    return this.entityManager.transaction(async (transactionManager) => {
      // --- BÊN TRONG TRANSACTION ---

      // 1. Kiểm tra Appointment và lấy thông tin BS, Chuyên Khoa
      const appointment = await transactionManager.findOne(Appointment, {
        where: { id: appointmentId },
        relations: [
          'doctor', // Cần thông tin bác sĩ
          'doctor.specialty', // Cần chuyên khoa của bác sĩ để lấy phí khám
        ],
      });

      if (!appointment) {
        throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${appointmentId}`);
      }
      if (appointment.status !== AppointmentStatus.CONFIRMED) {
        throw new BadRequestException('Lịch hẹn này không ở trạng thái có thể khám.');
      }
      // Lấy phí khám cơ bản từ chuyên khoa của bác sĩ
      const base_cost = appointment.doctor?.specialty?.base_cost || 0;
      let total_medicine_cost = 0; // Biến tạm để tính tổng tiền thuốc

      // 2. Tạo Medical Record (chưa có total_cost)
      const medicalRecord = transactionManager.create(MedicalRecord, {
        diagnosis,
        symptoms,
        notes,
        appointment,
      });
      // Lưu lại để lấy ID
      const savedMedicalRecord = await transactionManager.save(medicalRecord);

      // 3. Xử lý đơn thuốc (nếu có)
      if (prescriptionItems && prescriptionItems.length > 0) {
        // Tạo Prescription
        const prescription = transactionManager.create(Prescription, {
          medicalRecord: savedMedicalRecord,
        });
        const savedPrescription = await transactionManager.save(prescription);

        // Tạo các Prescription Items
        for (const itemDto of prescriptionItems) {
          // Kiểm tra Medicine tồn tại và lấy giá
          const medicine = await transactionManager.findOne(Medicine, {
            where: { id: itemDto.medicineId },
          });
          if (!medicine) {
            throw new NotFoundException(`Không tìm thấy thuốc với ID ${itemDto.medicineId}`);
          }

          // Cộng dồn tiền thuốc
          total_medicine_cost += medicine.price * itemDto.quantity;

          const prescriptionItem = transactionManager.create(PrescriptionItem, {
            quantity: itemDto.quantity,
            dosage: itemDto.dosage,
            prescription: savedPrescription,
            medicine: medicine,
          });
          await transactionManager.save(prescriptionItem);
        }
      }

      // 4. Tính toán và Cập nhật Tổng Chi Phí
      const total_cost = base_cost + total_medicine_cost;
      savedMedicalRecord.total_cost = total_cost;

      // Lưu lại medical record với thông tin total_cost
      const finalMedicalRecord = await transactionManager.save(savedMedicalRecord);

      // 5. Cập nhật trạng thái Appointment thành COMPLETED
      appointment.status = AppointmentStatus.COMPLETED;
      await transactionManager.save(appointment);

      // --- KẾT THÚC TRANSACTION ---
      return finalMedicalRecord; // Trả về Medical Record đã hoàn chỉnh
    });
  }
  async findAllForPatient(patientId: number): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({
      where: { appointment: { patient: { id: patientId } } },
      relations: ['appointment', 'appointment.doctor'], // Lấy kèm thông tin cuộc hẹn và bác sĩ
      order: { id: 'DESC' }, // Sắp xếp mới nhất lên đầu
    });
  }

  async findByAppointmentId(appointmentId: number): Promise<MedicalRecord> {
    const record = await this.entityManager.findOne(MedicalRecord, {
      where: { appointment: { id: appointmentId } },
      relations: [
        'appointment',
        'appointment.doctor',
        'appointment.doctor.specialty', // Lấy chuyên khoa
        'prescription', // Lấy đơn thuốc
        'prescription.items', // Lấy các mục trong đơn
        'prescription.items.medicine', // Lấy thông tin chi tiết từng loại thuốc
      ],
    });

    if (!record) {
      throw new NotFoundException(`Không tìm thấy hồ sơ khám bệnh nào cho lịch hẹn ID ${appointmentId}`);
    }
    return record;
  }
}
