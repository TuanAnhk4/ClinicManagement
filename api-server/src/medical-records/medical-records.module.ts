import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsService } from './medical-records.service';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import { PrescriptionItem } from 'src/prescription-items/entities/prescription-item.entity';
import { Medicine } from 'src/medicines/entities/medicine.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicalRecord,
      Appointment,
      Prescription,
      PrescriptionItem,
      Medicine, // Cần Medicine để kiểm tra thuốc tồn tại
    ]),
    // Import các module khác nếu cần (ví dụ: AppointmentsModule nếu cần service của nó)
  ],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
