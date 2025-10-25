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

    // Sử dụng transaction để đảm bảo tất cả các bước thành công hoặc thất bại cùng lúc
    return this.entityManager.transaction(async (transactionalEntityManager) => {
      // --- BÊN TRONG TRANSACTION ---

      // 1. Kiểm tra Appointment tồn tại và chưa hoàn thành
      const appointment = await transactionalEntityManager.findOne(Appointment, {
        where: { id: appointmentId },
      });
      if (!appointment) {
        throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${appointmentId}`);
      }
      if (appointment.status !== AppointmentStatus.CONFIRMED) {
        throw new BadRequestException('Lịch hẹn này không ở trạng thái có thể khám.');
      }

      // 2. Tạo Medical Record
      const medicalRecord = transactionalEntityManager.create(MedicalRecord, {
        diagnosis,
        symptoms,
        notes,
        appointment,
      });
      const savedMedicalRecord = await transactionalEntityManager.save(medicalRecord);

      // 3. Xử lý đơn thuốc (nếu có)
      if (prescriptionItems && prescriptionItems.length > 0) {
        // Tạo Prescription
        const prescription = transactionalEntityManager.create(Prescription, {
          medicalRecord: savedMedicalRecord,
        });
        const savedPrescription = await transactionalEntityManager.save(prescription);

        // Tạo các Prescription Items
        for (const itemDto of prescriptionItems) {
          // Kiểm tra Medicine tồn tại
          const medicine = await this.medicineRepository.findOneBy({ id: itemDto.medicineId });
          if (!medicine) {
            throw new NotFoundException(`Không tìm thấy thuốc với ID ${itemDto.medicineId}`);
          }

          const prescriptionItem = transactionalEntityManager.create(PrescriptionItem, {
            quantity: itemDto.quantity,
            dosage: itemDto.dosage,
            prescription: savedPrescription,
            medicine: medicine,
          });
          await transactionalEntityManager.save(prescriptionItem);
        }
      }

      // 4. Cập nhật trạng thái Appointment thành COMPLETED
      appointment.status = AppointmentStatus.COMPLETED;
      await transactionalEntityManager.save(appointment);

      // --- KẾT THÚC TRANSACTION ---
      return savedMedicalRecord; // Trả về Medical Record đã tạo
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
    const record = await this.medicalRecordRepository.findOne({
      where: { appointment: { id: appointmentId } },
      // Lấy kèm các thông tin liên quan nếu cần, ví dụ đơn thuốc
      // relations: ['appointment', 'prescription', 'prescription.items', 'prescription.items.medicine'],
      relations: [
        'appointment',
        'appointment.doctor',
        'prescription', // Lấy thông tin đơn thuốc
        'prescription.items', // Lấy các mục trong đơn thuốc
        'prescription.items.medicine', // Lấy thông tin chi tiết của từng loại thuốc
      ],
    });

    if (!record) {
      throw new NotFoundException(`Không tìm thấy hồ sơ khám bệnh nào cho lịch hẹn ID ${appointmentId}`);
    }
    return record;
  }

  // Thêm các hàm khác (ví dụ: getByAppointmentId) vào đây nếu cần
}
